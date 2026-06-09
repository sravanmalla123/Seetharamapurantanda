import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/grievance_portal.dart';
import 'screens/ration_tracker.dart';

void main() {
  runApp(const SeetharamapuramApp());
}

class SeetharamapuramApp extends StatelessWidget {
  const SeetharamapuramApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Seetharamapuram Tanda Panchayat',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF14281C), // Forest Emerald
          primary: const Color(0xFF14281C),
          secondary: const Color(0xFF4ABD7E), // Minty Green
          tertiary: const Color(0xFFF5A623), // Amber Gold
          background: const Color(0xFFF9FBF9),
        ),
        fontFamily: 'Outfit',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF14281C),
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 2,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/home': (context) => const HomeScreen(),
        '/grievances': (context) => const GrievancePortal(),
        '/ration': (context) => const RationTracker(),
      },
    );
  }
}
