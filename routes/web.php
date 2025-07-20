<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CodeController;

Route::view('/', 'editor');
Route::post('/run-code', [CodeController::class, 'run']);
Route::post('/ai-helper', [CodeController::class, 'ai']);
