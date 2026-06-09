import 'package:flutter/material.dart';
import '../services/api_service.dart';

class GrievancePortal extends StatefulWidget {
  const GrievancePortal({super.key});

  @override
  State<GrievancePortal> createState() => _GrievancePortalState();
}

class _GrievancePortalState extends State<GrievancePortal> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // File Grievance Form State
  final _fileFormKey = GlobalKey<FormState>();
  String _name = '';
  String _phone = '';
  String _category = 'water'; // Default
  String _desc = '';
  bool _isFiling = false;

  // Track Grievance State
  final _trackFormKey = GlobalKey<FormState>();
  final _trackIdController = TextEditingController();
  bool _isTracking = false;
  Map<String, dynamic>? _trackedTicket;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _trackIdController.dispose();
    super.dispose();
  }

  // Handle Filing
  void _submitGrievance() async {
    if (!_fileFormKey.currentState!.validate()) return;
    _fileFormKey.currentState!.save();

    setState(() {
      _isFiling = true;
    });

    final result = await ApiService.fileGrievance(
      name: _name,
      phone: _phone,
      category: _category,
      desc: _desc,
    );

    setState(() {
      _isFiling = false;
    });

    if (result != null && result['id'] != null) {
      final newId = result['id'];
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 Grievance filed successfully! Ticket ID: $newId'),
          backgroundColor: const Color(0xFF4ABD7E),
        ),
      );
      _fileFormKey.currentState!.reset();

      // Switch to tracking tab automatically and set ticket ID
      setState(() {
        _trackIdController.text = newId;
      });
      _tabController.animateTo(1);
      _fetchGrievance(newId);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('❌ Failed to file grievance. Please check your backend connection.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  // Handle Tracking
  void _fetchGrievance(String ticketId) async {
    final cleanId = ticketId.trim().toUpperCase();
    if (cleanId.isEmpty) return;

    setState(() {
      _isTracking = true;
      _trackedTicket = null;
      _errorMessage = null;
    });

    final result = await ApiService.getGrievance(cleanId);

    setState(() {
      _isTracking = false;
    });

    if (result != null) {
      setState(() {
        _trackedTicket = result;
      });
    } else {
      setState(() {
        _errorMessage = 'Ticket ID "$cleanId" not found. Check the ID and try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FBF9),
      appBar: AppBar(
        title: const Text(
          'Grievance Redressal Portal',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white.withOpacity(0.6),
          indicatorColor: const Color(0xFFF5A623),
          indicatorWeight: 3,
          tabs: const [
            Tab(icon: Icon(Icons.edit_note), text: 'File Concern'),
            Tab(icon: Icon(Icons.track_changes), text: 'Track Status'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: File Concern
          _buildFileTab(),
          
          // Tab 2: Track Status
          _buildTrackTab(),
        ],
      ),
    );
  }

  Widget _buildFileTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Card(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFECECEC)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Form(
            key: _fileFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Submit a New Grievance',
                  style: TextStyle(
                    color: Color(0xFF14281C),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Your private details (Name, Phone) are encrypted at rest using secure AES-256 block ciphers.',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 20),

                // Name Input
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    hintText: 'Enter your name',
                    filled: true,
                    fillColor: const Color(0xFFF9FBF9),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.person_outline),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Name is required' : null,
                  onSaved: (v) => _name = v!.trim(),
                ),
                const SizedBox(height: 16),

                // Phone Input
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Mobile Number',
                    hintText: '10-digit mobile number',
                    filled: true,
                    fillColor: const Color(0xFFF9FBF9),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.phone_iphone_outlined),
                  ),
                  keyboardType: TextInputType.phone,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Phone number is required';
                    if (!RegExp(r'^\d{10}$').hasMatch(v.trim())) return 'Enter a valid 10-digit number';
                    return null;
                  },
                  onSaved: (v) => _phone = v!.trim(),
                ),
                const SizedBox(height: 16),

                // Category Dropdown
                DropdownButtonFormField<String>(
                  value: _category,
                  decoration: InputDecoration(
                    labelText: 'Concern Category',
                    filled: true,
                    fillColor: const Color(0xFFF9FBF9),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.category_outlined),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'water', child: Text('💧 Water Supply / Rationing')),
                    DropdownMenuItem(value: 'road', child: Text('🛣️ Road Quality & Repairs')),
                    DropdownMenuItem(value: 'ration', child: Text('📋 Ration Shop Allocations')),
                    DropdownMenuItem(value: 'street_light', child: Text('💡 Streetlight Outages')),
                    DropdownMenuItem(value: 'waste', child: Text('🧹 Sanitation & Waste Disposal')),
                    DropdownMenuItem(value: 'other', child: Text('❓ General Livelihood Query')),
                  ],
                  onChanged: (val) {
                    setState(() {
                      _category = val!;
                    });
                  },
                ),
                const SizedBox(height: 16),

                // Description Input
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Grievance Details',
                    hintText: 'Describe your issue in detail...',
                    filled: true,
                    fillColor: const Color(0xFFF9FBF9),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.description_outlined),
                  ),
                  maxLines: 4,
                  validator: (v) => (v == null || v.trim().length < 10) ? 'Provide at least 10 characters' : null,
                  onSaved: (v) => _desc = v!.trim(),
                ),
                const SizedBox(height: 24),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF14281C),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _isFiling ? null : _submitGrievance,
                    child: _isFiling
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                          )
                        : const Text(
                            'Submit Official Grievance',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTrackTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          // Tracker search bar
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
                key: _trackFormKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Query Grievance Timeline',
                      style: TextStyle(
                        color: Color(0xFF14281C),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _trackIdController,
                            decoration: InputDecoration(
                              labelText: 'Grievance Ticket ID',
                              hintText: 'e.g. GP-2026-X1Y2',
                              filled: true,
                              fillColor: const Color(0xFFF9FBF9),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              prefixIcon: const Icon(Icons.tag),
                            ),
                            validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter a valid Ticket ID' : null,
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
                            onPressed: _isTracking ? null : () {
                              if (_trackFormKey.currentState!.validate()) {
                                _fetchGrievance(_trackIdController.text);
                              }
                            },
                            child: _isTracking
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

          // Loading, Error, or Result Display
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

          if (_trackedTicket != null) ...[
            // Ticket Info Card
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
                        Text(
                          'Ticket ID: ${_trackedTicket!['id']}',
                          style: const TextStyle(
                            color: Color(0xFF14281C),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        _buildStatusBadge(_trackedTicket!['status']),
                      ],
                    ),
                    const Divider(height: 24),
                    Text(
                      'Category: ${_trackedTicket!['category'].toString().toUpperCase()}',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF14281C),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Details: ${_trackedTicket!['desc']}',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[800],
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Timeline Card
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
                      'Resolution Timeline',
                      style: TextStyle(
                        color: Color(0xFF14281C),
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildTimelineFlow(),
                  ],
                ),
              ),
            ),
          ]
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bg = const Color(0xFFECECEC);
    Color fg = const Color(0xFF14281C);

    if (status == 'Resolved') {
      bg = const Color(0xFF4ABD7E).withOpacity(0.15);
      fg = const Color(0xFF14281C);
    } else if (status == 'Submitted') {
      bg = Colors.blue.shade50;
      fg = Colors.blue.shade800;
    } else if (status == 'In Progress') {
      bg = Colors.amber.shade50;
      fg = Colors.amber.shade900;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: fg,
          fontSize: 11,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildTimelineFlow() {
    final history = _trackedTicket!['history'] as List<dynamic>;
    final status = _trackedTicket!['status'] as String;

    List<Widget> timelineItems = [];

    // Render completed steps
    for (int i = 0; i < history.length; i++) {
      final step = history[i];
      final isLast = (i == history.length - 1) && (status == 'Resolved');
      
      timelineItems.add(
        _buildTimelineStep(
          stepNumber: i + 1,
          title: step['status'],
          detail: step['detail'],
          time: step['time'],
          isActive: i == history.length - 1 && status != 'Resolved',
          isCompleted: true,
          showLine: i < history.length - 1 || status != 'Resolved',
        ),
      );
    }

    // Append pending mock steps based on current status
    if (status == 'Submitted') {
      timelineItems.add(_buildTimelineStep(
        stepNumber: history.length + 1,
        title: 'Under Verification',
        detail: 'Panchayat officials will verify details on ground.',
        time: '--',
        isActive: false,
        isCompleted: false,
        showLine: true,
      ));
      timelineItems.add(_buildTimelineStep(
        stepNumber: history.length + 2,
        title: 'Officer Investigation',
        detail: 'Investigation by allocated ward representatives.',
        time: '--',
        isActive: false,
        isCompleted: false,
        showLine: true,
      ));
      timelineItems.add(_buildTimelineStep(
        stepNumber: history.length + 3,
        title: 'Resolution Implementation',
        detail: 'Field works or administrative corrections.',
        time: '--',
        isActive: false,
        isCompleted: false,
        showLine: false,
      ));
    } else if (status == 'In Progress') {
      timelineItems.add(_buildTimelineStep(
        stepNumber: history.length + 1,
        title: 'Resolution Implementation',
        detail: 'Rectification works in progress.',
        time: '--',
        isActive: false,
        isCompleted: false,
        showLine: true,
      ));
      timelineItems.add(_buildTimelineStep(
        stepNumber: history.length + 2,
        title: 'Resolved & Finalised',
        detail: 'Resolution sign-off by Gram Sabha representative.',
        time: '--',
        isActive: false,
        isCompleted: false,
        showLine: false,
      ));
    }

    return Column(
      children: timelineItems,
    );
  }

  Widget _buildTimelineStep({
    required int stepNumber,
    required String title,
    required String detail,
    required String time,
    required bool isActive,
    required bool isCompleted,
    required bool showLine,
  }) {
    Color markerColor = Colors.grey.shade300;
    Color textColor = Colors.grey.shade500;
    if (isCompleted) {
      markerColor = const Color(0xFF4ABD7E);
      textColor = const Color(0xFF14281C);
    }
    if (isActive) {
      markerColor = const Color(0xFFF5A623);
      textColor = const Color(0xFF14281C);
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step marker & connecting line
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: markerColor,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  stepNumber.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              if (showLine)
                Expanded(
                  child: Container(
                    width: 2,
                    color: isCompleted ? const Color(0xFF4ABD7E) : Colors.grey.shade300,
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),

          // Step details
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          color: textColor,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        time,
                        style: TextStyle(
                          color: Colors.grey.shade500,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    detail,
                    style: TextStyle(
                      color: isCompleted ? Colors.grey[700] : Colors.grey[500],
                      fontSize: 12,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
