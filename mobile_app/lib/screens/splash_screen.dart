import 'dart:async';
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final String title = 'SEETHARAMAPURAM TANDA';
  bool logoVisible = false;
  bool titleVisible = false;
  bool subtitleVisible = false;
  bool progressVisible = false;

  @override
  void initState() {
    super.initState();
    _startAnimation();
  }

  void _startAnimation() async {
    // 1. Logo fades in
    await Future.delayed(const Duration(milliseconds: 300));
    setState(() {
      logoVisible = true;
    });

    // 2. Entire title slides/fades in together (Performance optimization to prevent layout lag)
    await Future.delayed(const Duration(milliseconds: 400));
    setState(() {
      titleVisible = true;
    });

    // 3. Subtitle fades in
    await Future.delayed(const Duration(milliseconds: 300));
    setState(() {
      subtitleVisible = true;
    });

    // 4. Progress bar fades in
    await Future.delayed(const Duration(milliseconds: 200));
    setState(() {
      progressVisible = true;
    });

    // 5. Navigate to Home
    await Future.delayed(const Duration(milliseconds: 1800));
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07120B), // Deep Dark Green
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              AnimatedOpacity(
                opacity: logoVisible ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 800),
                child: const Icon(
                  Icons.wb_sunny_outlined,
                  color: Color(0xFFF5A623), // Amber Gold
                  size: 80,
                ),
              ),
              const SizedBox(height: 24),

              // Title
              AnimatedOpacity(
                opacity: titleVisible ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 800),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 800),
                  transform: Matrix4.translationValues(0, titleVisible ? 0 : 15, 0),
                  child: Text(
                    title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 3,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // Subtitle
              AnimatedOpacity(
                opacity: subtitleVisible ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 650),
                child: const Text(
                  'GRAM PANCHAYAT PORTAL',
                  style: TextStyle(
                    color: Color(0xFF4ABD7E), // Mint Green
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 4,
                  ),
                ),
              ),
              const SizedBox(height: 40),

              // Loader progress indicator bar
              AnimatedOpacity(
                opacity: progressVisible ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 500),
                child: SizedBox(
                  width: 140,
                  height: 3,
                  child: LinearProgressIndicator(
                    color: const Color(0xFFF5A623),
                    backgroundColor: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
