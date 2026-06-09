@echo off
title Seetharamapuram Tanda Gram Panchayat Portal
echo ==========================================================
echo   Starting Seetharamapuram Tanda Gram Panchayat Portal Backend
echo ==========================================================
echo.
echo [1/2] Opening civic portal in your default web browser...
start http://10.253.91.42:8000
echo.
echo [2/2] Launching Node.js full-stack server...
node api/server.js
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Node.js is not running correctly. Make sure Node.js is installed.
  pause
)
