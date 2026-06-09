import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Welfare Schemes Data
  final List<Map<String, String>> welfareSchemes = [
    {
      'name': 'Rythu Bandhu (Farmer Investment Support)',
      'category': 'Agriculture',
      'desc': 'Provides seasonal input support grants of ₹5,000 per acre per season directly to farmers for buying seeds, fertilizer, and labor inputs.',
      'criteria': 'Landowner Farmer with land registered in village records.'
    },
    {
      'name': 'Aasara Pensions (Elderly & Widow Support)',
      'category': 'Social Security',
      'desc': 'Provides monthly financial pensions of ₹2,016 to secure livelihoods for elderly villagers, widows, and local manual weavers.',
      'criteria': 'Age over 57, widows, weaver artisans with family income under ₹1.5 Lakhs.'
    },
    {
      'name': 'Kalyana Lakshmi / Shaadi Mubarak',
      'category': 'Community',
      'desc': 'One-time financial assistance of ₹1,00,116 given during weddings to prevent wedding debts among minority families.',
      'criteria': 'Brides aged 18+ from low-income families (income < ₹2 Lakhs).'
    },
    {
      'name': 'PM-KISAN Samman Nidhi',
      'category': 'Central Scheme',
      'desc': 'Direct benefit transfer of ₹6,000 per year paid in three equal installments to rural landholder farmer families.',
      'criteria': 'Small and marginal farmers holding cultivable land records.'
    }
  ];

  // For Eligibility Checker
  final _formKey = GlobalKey<FormState>();
  int _age = 18;
  String _occupation = 'farmer';
  double _land = 0.0;
  int _income = 100000;
  List<Map<String, String>> _eligibleSchemes = [];
  bool _checkedEligibility = false;

  void _checkEligibility() {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    List<Map<String, String>> temp = [];

    // Rythu Bandhu: farmer and land size > 0
    if (_occupation == 'farmer' && _land > 0) {
      temp.add(welfareSchemes[0]);
    }
    // Aasara Pensions: age >= 57 or retired/weaver, and low income
    if ((_age >= 57 || _occupation == 'weaver' || _occupation == 'retired') && _income <= 150000) {
      temp.add(welfareSchemes[1]);
    }
    // Kalyana Lakshmi: income <= 200000
    if (_income <= 200000) {
      temp.add(welfareSchemes[2]);
    }
    // PM-KISAN: farmer and land size > 0 and <= 5
    if (_occupation == 'farmer' && _land > 0 && _land <= 5) {
      temp.add(welfareSchemes[3]);
    }

    setState(() {
      _eligibleSchemes = temp;
      _checkedEligibility = true;
    });
  }

  void _showWelfareModal() {
    setState(() {
      _checkedEligibility = false;
      _eligibleSchemes = [];
      _age = 18;
      _land = 0.0;
      _income = 100000;
      _occupation = 'farmer';
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: const BoxDecoration(
                color: Color(0xFFF9FBF9),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: Column(
                children: [
                  // Drag indicator & Header
                  Container(
                    width: 40,
                    height: 5,
                    margin: const EdgeInsets.only(top: 12, bottom: 8),
                    decoration: BoxDecoration(
                      color: Colors.grey[400],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Welfare Schemes & Eligibility',
                          style: TextStyle(
                            color: Color(0xFF14281C),
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Color(0xFF14281C)),
                          onPressed: () => Navigator.pop(context),
                        )
                      ],
                    ),
                  ),
                  const Divider(),
                  
                  // Tab contents: simple inline selector inside bottom sheet
                  Expanded(
                    child: DefaultTabController(
                      length: 2,
                      child: Column(
                        children: [
                          TabBar(
                            labelColor: const Color(0xFF14281C),
                            unselectedLabelColor: Colors.grey,
                            indicatorColor: const Color(0xFFF5A623),
                            tabs: const [
                              Tab(text: 'Browse Schemes'),
                              Tab(text: 'Eligibility Calculator'),
                            ],
                          ),
                          Expanded(
                            child: TabBarView(
                              children: [
                                // Tab 1: Browse
                                ListView.builder(
                                  padding: const EdgeInsets.all(16),
                                  itemCount: welfareSchemes.length,
                                  itemBuilder: (context, index) {
                                    final scheme = welfareSchemes[index];
                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 16),
                                      color: Colors.white,
                                      surfaceTintColor: Colors.transparent,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
                                        side: const BorderSide(color: Color(0xFFECECEC)),
                                      ),
                                      elevation: 0,
                                      child: Padding(
                                        padding: const EdgeInsets.all(16),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Expanded(
                                                  child: Text(
                                                    scheme['name']!,
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
                                                    color: const Color(0xFF4ABD7E).withOpacity(0.1),
                                                    borderRadius: BorderRadius.circular(20),
                                                  ),
                                                  child: Text(
                                                    scheme['category']!,
                                                    style: const TextStyle(
                                                      color: Color(0xFF14281C),
                                                      fontSize: 10,
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                )
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              scheme['desc']!,
                                              style: TextStyle(
                                                color: Colors.grey[700],
                                                fontSize: 13,
                                              ),
                                            ),
                                            const SizedBox(height: 12),
                                            Container(
                                              padding: const EdgeInsets.all(10),
                                              width: double.infinity,
                                              decoration: BoxDecoration(
                                                color: const Color(0xFFF0F4F1),
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: Text(
                                                'Criteria: ${scheme['criteria']!}',
                                                style: const TextStyle(
                                                  color: Color(0xFF14281C),
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            )
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),

                                // Tab 2: Eligibility Calculator
                                SingleChildScrollView(
                                  padding: const EdgeInsets.all(16),
                                  child: Form(
                                    key: _formKey,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Check your eligible panchayat benefits instantly:',
                                          style: TextStyle(
                                            color: Colors.grey,
                                            fontSize: 13,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        const SizedBox(height: 16),
                                        
                                        // Age Input
                                        TextFormField(
                                          initialValue: _age.toString(),
                                          decoration: InputDecoration(
                                            labelText: 'Applicant Age',
                                            filled: true,
                                            fillColor: Colors.white,
                                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                            prefixIcon: const Icon(Icons.person_outline),
                                          ),
                                          keyboardType: TextInputType.number,
                                          validator: (v) {
                                            if (v == null || int.tryParse(v) == null) {
                                              return 'Enter a valid age';
                                            }
                                            return null;
                                          },
                                          onSaved: (v) => _age = int.parse(v!),
                                        ),
                                        const SizedBox(height: 16),

                                        // Occupation Selector
                                        DropdownButtonFormField<String>(
                                          value: _occupation,
                                          decoration: InputDecoration(
                                            labelText: 'Primary Occupation',
                                            filled: true,
                                            fillColor: Colors.white,
                                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                            prefixIcon: const Icon(Icons.work_outline),
                                          ),
                                          items: const [
                                            DropdownMenuItem(value: 'farmer', child: Text('Farmer / Landowner')),
                                            DropdownMenuItem(value: 'weaver', child: Text('Weaver Artisan')),
                                            DropdownMenuItem(value: 'retired', child: Text('Retired / Senior Citizen')),
                                            DropdownMenuItem(value: 'labor', child: Text('Manual Labor')),
                                            DropdownMenuItem(value: 'other', child: Text('Other / Self-employed')),
                                          ],
                                          onChanged: (val) {
                                            setModalState(() {
                                              _occupation = val!;
                                            });
                                          },
                                        ),
                                        const SizedBox(height: 16),

                                        // Landholding Size
                                        TextFormField(
                                          initialValue: _land.toString(),
                                          decoration: InputDecoration(
                                            labelText: 'Agricultural Land Owned (in Acres)',
                                            filled: true,
                                            fillColor: Colors.white,
                                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                            prefixIcon: const Icon(Icons.landscape_outlined),
                                          ),
                                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                          validator: (v) {
                                            if (v == null || double.tryParse(v) == null) {
                                              return 'Enter land size in acres (0 for none)';
                                            }
                                            return null;
                                          },
                                          onSaved: (v) => _land = double.parse(v!),
                                        ),
                                        const SizedBox(height: 16),

                                        // Annual Family Income
                                        TextFormField(
                                          initialValue: _income.toString(),
                                          decoration: InputDecoration(
                                            labelText: 'Annual Family Income (in ₹)',
                                            filled: true,
                                            fillColor: Colors.white,
                                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                            prefixIcon: const Icon(Icons.currency_rupee),
                                          ),
                                          keyboardType: TextInputType.number,
                                          validator: (v) {
                                            if (v == null || int.tryParse(v) == null) {
                                              return 'Enter annual family income';
                                            }
                                            return null;
                                          },
                                          onSaved: (v) => _income = int.parse(v!),
                                        ),
                                        const SizedBox(height: 20),

                                        // Calculate Button
                                        SizedBox(
                                          width: double.infinity,
                                          height: 48,
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: const Color(0xFF14281C),
                                              foregroundColor: Colors.white,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                            ),
                                            onPressed: () {
                                              // Perform logic
                                              _formKey.currentState!.save();
                                              List<Map<String, String>> temp = [];

                                              if (_occupation == 'farmer' && _land > 0) {
                                                temp.add(welfareSchemes[0]);
                                              }
                                              if ((_age >= 57 || _occupation == 'weaver' || _occupation == 'retired') && _income <= 150000) {
                                                temp.add(welfareSchemes[1]);
                                              }
                                              if (_income <= 200000) {
                                                temp.add(welfareSchemes[2]);
                                              }
                                              if (_occupation == 'farmer' && _land > 0 && _land <= 5) {
                                                temp.add(welfareSchemes[3]);
                                              }

                                              setModalState(() {
                                                _eligibleSchemes = temp;
                                                _checkedEligibility = true;
                                              });
                                            },
                                            child: const Text(
                                              'Verify Benefits Eligibility',
                                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 24),

                                        // Results Panel
                                        if (_checkedEligibility) ...[
                                          const Text(
                                            'Evaluation Results:',
                                            style: TextStyle(
                                              color: Color(0xFF14281C),
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(height: 12),
                                          if (_eligibleSchemes.isEmpty)
                                            Container(
                                              width: double.infinity,
                                              padding: const EdgeInsets.all(16),
                                              decoration: BoxDecoration(
                                                color: Colors.amber.shade50,
                                                borderRadius: BorderRadius.circular(12),
                                                border: Border.all(color: Colors.amber.shade200),
                                              ),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    children: [
                                                      Icon(Icons.info_outline, color: Colors.amber.shade800),
                                                      const SizedBox(width: 8),
                                                      Text(
                                                        'No Schemes Matched',
                                                        style: TextStyle(
                                                          color: Colors.amber.shade900,
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  const SizedBox(height: 8),
                                                  const Text(
                                                    'Your details do not match current eligibility thresholds. Please visit the Panchayat office for manual review.',
                                                    style: TextStyle(fontSize: 12),
                                                  ),
                                                ],
                                              ),
                                            )
                                          else
                                            ..._eligibleSchemes.map((scheme) {
                                              return Card(
                                                margin: const EdgeInsets.only(bottom: 12),
                                                color: Colors.green.shade50,
                                                elevation: 0,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(12),
                                                  side: BorderSide(color: Colors.green.shade200),
                                                ),
                                                child: Padding(
                                                  padding: const EdgeInsets.all(12),
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Row(
                                                        children: [
                                                          const Icon(Icons.check_circle, color: Colors.green),
                                                          const SizedBox(width: 8),
                                                          Expanded(
                                                            child: Text(
                                                              scheme['name']!,
                                                              style: TextStyle(
                                                                color: Colors.green.shade900,
                                                                fontWeight: FontWeight.bold,
                                                                fontSize: 14,
                                                              ),
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                      const SizedBox(height: 6),
                                                      Text(
                                                        scheme['desc']!,
                                                        style: const TextStyle(fontSize: 12),
                                                      ),
                                                      const SizedBox(height: 6),
                                                      Text(
                                                        'Criteria Met: ${scheme['criteria']!}',
                                                        style: TextStyle(
                                                          fontSize: 11,
                                                          fontWeight: FontWeight.bold,
                                                          color: Colors.green.shade800,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              );
                                            }).toList(),
                                        ]
                                      ],
                                    ),
                                  ),
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  )
                ],
              );
            };
          }
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FBF9),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Accent Banner / Header Stack
            Stack(
              children: [
                Container(
                  height: 240,
                  decoration: const BoxDecoration(
                    color: Color(0xFF14281C), // Forest Emerald
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(36),
                      bottomRight: Radius.circular(36),
                    ),
                  ),
                ),
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // App Brand
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.12),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.wb_sunny_outlined,
                                    color: Color(0xFFF5A623), // Amber Gold
                                    size: 32,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: const [
                                    Text(
                                      'Seetharamapuram Tanda',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                    Text(
                                      'GRAM PANCHAYAT PORTAL',
                                      style: TextStyle(
                                        color: Color(0xFF4ABD7E), // Minty Green
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 2,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF5A623),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                'OFFICIAL',
                                style: TextStyle(
                                  color: Color(0xFF14281C),
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 36),
                        
                        // Welcome text
                        const Text(
                          'Welcome to Seetharamapuram Tanda',
                          style: TextStyle(
                            color: Color(0xFF4ABD7E),
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          '"Preserving Heritage, Striving for Sustainable Progress"',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            
            // Content Padding
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Section Title: Civic Services
                  const Text(
                    'Direct Livelihood & Civic Support',
                    style: TextStyle(
                      color: Color(0xFF14281C),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Service Grid
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.1,
                    children: [
                      _buildServiceCard(
                        icon: Icons.assignment_turned_in_outlined,
                        title: 'Welfare Schemes',
                        subtitle: ' Rythu Bandhu, Pension Check',
                        color: const Color(0xFF14281C),
                        onTap: _showWelfareModal,
                      ),
                      _buildServiceCard(
                        icon: Icons.feedback_outlined,
                        title: 'Grievance Portal',
                        subtitle: 'File issues & track status',
                        color: const Color(0xFF4ABD7E),
                        onTap: () => Navigator.pushNamed(context, '/grievances'),
                      ),
                      _buildServiceCard(
                        icon: Icons.badge_outlined,
                        title: 'Ration Tracker',
                        subtitle: 'Check stock & allocations',
                        color: const Color(0xFFF5A623),
                        onTap: () => Navigator.pushNamed(context, '/ration'),
                      ),
                      _buildServiceCard(
                        icon: Icons.health_and_safety_outlined,
                        title: 'Health Services',
                        subtitle: 'Immunisations & subcenter',
                        color: Colors.blue.shade800,
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('🩺 Health Camps: Next vaccine camp is June 13th at the local school sub-center.'),
                              duration: Duration(seconds: 4),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Village Asset & Resource Status
                  const Text(
                    'Village Resilience Status',
                    style: TextStyle(
                      color: Color(0xFF14281C),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Water card status
                  Card(
                    color: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: const BorderSide(color: Color(0xFFECECEC)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.blue.shade50,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.water_drop, color: Colors.blue.shade800, size: 28),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Panchayat Reservoir Level',
                                  style: TextStyle(
                                    color: Color(0xFF14281C),
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Container(
                                      width: 120,
                                      height: 8,
                                      child: LinearProgressIndicator(
                                        value: 0.78,
                                        color: Colors.blue.shade700,
                                        backgroundColor: Colors.blue.shade100,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '78% Full',
                                      style: TextStyle(
                                        color: Colors.blue.shade800,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Daily inspected. Smart recharge grid functioning.',
                                  style: TextStyle(color: Colors.grey[600], fontSize: 11),
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Forestry plantations status
                  Card(
                    color: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: const BorderSide(color: Color(0xFFECECEC)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.green.shade50,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.forest_outlined, color: Colors.green.shade800, size: 28),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Community Green Cover',
                                  style: TextStyle(
                                    color: Color(0xFF14281C),
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  '📍 37+ Geotagged Plantations (Neem, Teak, Bamboo) active for shade preservation and soil protection.',
                                  style: TextStyle(
                                    color: Color(0xFF14281C),
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Infrastructure Upgrades Status Card
                  Card(
                    color: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: const BorderSide(color: Color(0xFFECECEC)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange.shade50,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.construction_outlined, color: Colors.orange.shade800, size: 28),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Village Infrastructure Upgrades',
                                  style: TextStyle(
                                    color: Color(0xFF14281C),
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                RichText(
                                  text: TextSpan(
                                    style: const TextStyle(color: Color(0xFF14281C), fontSize: 12, height: 1.4),
                                    children: [
                                      const TextSpan(text: '• ZP High School (Digital Lab): ', style: TextStyle(fontWeight: FontWeight.bold)),
                                      TextSpan(text: 'In Progress (85% completed)\n', style: TextStyle(color: Colors.orange.shade800, fontWeight: FontWeight.bold)),
                                      const TextSpan(text: '• Bus Stand & Transit Shelter: ', style: TextStyle(fontWeight: FontWeight.bold)),
                                      TextSpan(text: 'Under Construction (60% completed)', style: TextStyle(color: Colors.orange.shade800, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Panchayat Notices Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text(
                        'Recent Notices & Circulars',
                        style: TextStyle(
                          color: Color(0xFF14281C),
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Icon(Icons.campaign_outlined, color: Color(0xFFF5A623)),
                    ],
                  ),
                  const SizedBox(height: 16),

                  _buildNoticeCard(
                    title: 'Emergency Gram Sabha Meeting',
                    desc: 'An emergency Gram Sabha is convened this Tuesday at 10 AM at the Panchayat Office to finalize rainwater harvesting schedules and check dry-spell borewell rationing limits.',
                    date: 'June 08, 2026',
                    type: 'Critical',
                  ),
                  _buildNoticeCard(
                    title: 'Bus Stand & ZP High School Upgrades',
                    desc: 'Panchayat approved procurement of solar roofing for the new Bus Stand shelter. Construction of the digital lab at the ZP High School has reached 85% completion, with inaugurations expected next month.',
                    date: 'June 08, 2026',
                    type: 'Welfare',
                  ),
                  _buildNoticeCard(
                    title: 'Rythu Bandhu Subsidy Disbursement',
                    desc: 'Farmer investment support applications for the Kharif season are now being validated. Submit land record copies at ward center No. 3.',
                    date: 'June 05, 2026',
                    type: 'Welfare',
                  ),
                  _buildNoticeCard(
                    title: 'Lambadi Heritage Exhibition',
                    desc: 'Special self-help group display celebrating Lambadi needlework and traditional mirror-work garments starting next Friday at the community center.',
                    date: 'June 02, 2026',
                    type: 'Culture',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFECECEC)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Color(0xFF14281C),
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 10,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNoticeCard({
    required String title,
    required String desc,
    required String date,
    required String type,
  }) {
    Color badgeColor = Colors.grey;
    if (type == 'Critical') badgeColor = Colors.red.shade700;
    if (type == 'Welfare') badgeColor = const Color(0xFF4ABD7E);
    if (type == 'Culture') badgeColor = const Color(0xFFF5A623);

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFECECEC)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: badgeColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  type.toUpperCase(),
                  style: TextStyle(
                    color: badgeColor,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                date,
                style: TextStyle(
                  color: Colors.grey[500],
                  fontSize: 11,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF14281C),
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            desc,
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 12,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}
