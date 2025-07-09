<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CodeController;

Route::get('/', function () {
    return view('editor');
});

Route::post(uri: '/run-code', action: [CodeController::class, 'run']);
Route::post(uri: '/ai-helper', action: [CodeController::class, 'ai']);

