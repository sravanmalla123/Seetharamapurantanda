import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RationTracker extends StatefulWidget {
  const RationTracker({super.key});

  @override
  State<RationTracker> createState() => _RationTrackerState();
}

class _RationTrackerState extends State<RationTracker> {
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _rationRecord;
  String? _errorMessage;

  @override
  void dispose() {
    _idController.dispose();
    super.dispose();
  }

  void _queryRationCard() async {
    if (!_formKey.currentState!.validate()) return;
    final cleanId = _idController.text.trim();

    setState(() {
      _isLoading = true;
      _rationRecord = null;
      _errorMessage = null;
    });

    final result = await ApiService.getRationCard(cleanId);

    setState(() {
      _isLoading = false;
    });

    if (result != null) {
      setState(() {
        _rationRecord = result;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('📋 Ration allocations loaded successfully.'),
          backgroundColor: Color(0xFF4ABD7E),
        ),
      );
    } else {
      setState(() {
        _errorMessage = 'Ration Card ID "$cleanId" not found. Please verify and try again. Try: 369805471203';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FBF9),
      appBar: AppBar(
        title: const Text(
          'Civic Ration Card Portal',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Search Input Form
            Card(
              color: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFECECEC)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Query Food Grain Allocation',
                        style: TextStyle(
                          color: Color(0xFF14281C),
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Search using your 12-digit Civil Ration Card Number to verify monthly allocations, registered household members, and fair price dealer stock details.',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // ID Input row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _idController,
                              decoration: InputDecoration(
                                labelText: 'Ration Card Number',
                                hintText: 'e.g. 369805471203',
                                filled: true,
                                fillColor: const Color(0xFFF9FBF9),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                prefixIcon: const Icon(Icons.credit_card_outlined),
                              ),
                              keyboardType: TextInputType.number,
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) return 'Required';
                                if (!RegExp(r'^\d{12}$').hasMatch(v.trim())) return 'Must be 12 digits';
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          SizedBox(
                            height: 56,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF14281C),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              onPressed: _isLoading ? null : _queryRationCard,
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                    )
                                  : const Text('Query'),
                            ),
                          )
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Error Message
            if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(16),
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade100),
                ),
                child: Text(
                  _errorMessage!,
                  style: TextStyle(color: Colors.red.shade900, fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ),

            // Loaded Results
            if (_rationRecord != null) ...[
              // Cardholder Info Card
              Card(
                color: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFECECEC)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              'Cardholder: ${_rationRecord!['owner']}',
                              style: const TextStyle(
                                color: Color(0xFF14281C),
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF5A623).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              _rationRecord!['type'] ?? 'White Card',
                              style: const TextStyle(
                                color: Color(0xFF14281C),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 24),
                      
                      // Stat metrics
                      _buildMetricRow('Card Status', _rationRecord!['status'], isStatus: true),
                      const SizedBox(height: 12),
                      _buildMetricRow('Registered FP Shop Code', _rationRecord!['shop']),
                      const SizedBox(height: 12),
                      _buildMetricRow('Total Registered Members', _rationRecord!['members'].toString()),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Allocations Card
              Card(
                color: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFECECEC)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Monthly Commodity Allocations',
                        style: TextStyle(
                          color: Color(0xFF14281C),
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Items grid or list
                      _buildAllocationRow(
                        icon: '🌾',
                        item: 'Rice Allocation',
                        quantity: _rationRecord!['rice'] ?? '0 kg',
                      ),
                      const Divider(),
                      _buildAllocationRow(
                        icon: '🍞',
                        item: 'Wheat Allocation',
                        quantity: _rationRecord!['wheat'] ?? '0 kg',
                      ),
                      const Divider(),
                      _buildAllocationRow(
                        icon: '💧',
                        item: 'Kerosene Allocation',
                        quantity: _rationRecord!['kerosene'] ?? '0 L',
                      ),
                    ],
                  ),
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildMetricRow(String label, String value, {bool isStatus = false}) {
    Color valColor = const Color(0xFF14281C);
    if (isStatus && value == 'Active') valColor = const Color(0xFF4ABD7E);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: valColor,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildAllocationRow({
    required String icon,
    required String item,
    required String quantity,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 20)),
              const SizedBox(width: 12),
              Text(
                item,
                style: const TextStyle(
                  color: Color(0xFF14281C),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          Text(
            quantity,
            style: const TextStyle(
              color: Color(0xFF14281C),
              fontSize: 15,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}
