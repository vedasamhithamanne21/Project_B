@echo off
mkdir routes
mkdir controllers
mkdir services
mkdir models

type nul > server.js
type nul > routes\files.js
type nul > controllers\fileController.js
type nul > services\fileService.js
type nul > models\fileModel.js
