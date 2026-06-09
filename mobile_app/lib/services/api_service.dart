import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static final List<String> _candidates = [
    'http://10.0.2.2:8000/api',
    'http://10.253.91.42:8000/api',
    'http://127.0.0.1:8000/api',
  ];

  static String baseUrl = 'http://10.253.91.42:8000/api'; // Default fallback
  static bool _discovered = false;

  static Future<void> _ensureUrlDiscovered() async {
    if (_discovered) return;

    final completer = Completer<String>();
    int failures = 0;

    for (final url in _candidates) {
      http.get(Uri.parse('$url/ration?id=369805471203'))
          .timeout(const Duration(milliseconds: 1500))
          .then((res) {
            if (res.statusCode == 200 && !completer.isCompleted) {
              completer.complete(url);
            } else {
              failures++;
              if (failures == _candidates.length && !completer.isCompleted) {
                completer.completeError('All failed');
              }
            }
          })
          .catchError((_) {
            failures++;
            if (failures == _candidates.length && !completer.isCompleted) {
              completer.completeError('All failed');
            }
          });
    }

    try {
      final activeUrl = await completer.future;
      baseUrl = activeUrl;
      _discovered = true;
      print('Auto-discovered working server URL: $baseUrl');
    } catch (e) {
      // If all candidates failed (e.g. offline testing), fallback to default
      _discovered = true; // prevent repeating discovery loop
      print('Backend URL auto-discovery failed. Falling back to default: $baseUrl');
    }
  }

  // Query a grievance ticket
  static Future<Map<String, dynamic>?> getGrievance(String id) async {
    await _ensureUrlDiscovered();
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/grievances?id=$id'))
          .timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error fetching grievance: $e');
    }
    return null;
  }

  // File a new grievance
  static Future<Map<String, dynamic>?> fileGrievance({
    required String name,
    required String phone,
    required String category,
    required String desc,
  }) async {
    await _ensureUrlDiscovered();
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/grievances'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'phone': phone,
          'category': category,
          'desc': desc,
        }),
      ).timeout(const Duration(seconds: 4));
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error filing grievance: $e');
    }
    return null;
  }

  // Query Ration Card allocations
  static Future<Map<String, dynamic>?> getRationCard(String id) async {
    await _ensureUrlDiscovered();
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/ration?id=$id'))
          .timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error querying ration card: $e');
    }
    return null;
  }
}
