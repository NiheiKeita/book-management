<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        try {
            return Socialite::driver('google')->redirect();
        } catch (\Exception $e) {
            \Log::error('Google OAuth redirect error: ' . $e->getMessage());
            \Log::error('Google OAuth redirect error trace: ' . $e->getTraceAsString());
            
            // 開発環境では詳細なエラーを表示
            $errorMessage = app()->environment('local') 
                ? 'Google認証エラー: ' . $e->getMessage()
                : 'Google認証の設定に問題があります。管理者にお問い合わせください。';
                
            return redirect()->route('landing')->with('error', $errorMessage);
        }
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::updateOrCreate(
                ['google_id' => $googleUser->getId()],
                [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar_url' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]
            );

            Auth::login($user);

            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            \Log::error('Google OAuth callback error: ' . $e->getMessage());
            return redirect()->route('landing')->with('error', 'Google認証に失敗しました。' . $e->getMessage());
        }
    }
}
