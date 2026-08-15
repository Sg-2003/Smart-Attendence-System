"use client";

import { useState } from "react";
import { Bell, Lock, Shield, Eye, Save } from "lucide-react";

export default function StudentSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [gpsPrivacy, setGpsPrivacy] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage notifications, security preferences, and privacy options.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Notifications */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Push Notifications</div>
                <div className="text-xs text-slate-400">Receive alerts for low attendance & upcoming classes</div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Reports</div>
                <div className="text-xs text-slate-400">Receive weekly attendance summary emails</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Privacy */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            GPS Privacy & Location
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Strict Geofencing Verification</div>
              <div className="text-xs text-slate-400">Verify GPS coordinate radius during attendance submission</div>
            </div>
            <input
              type="checkbox"
              checked={gpsPrivacy}
              onChange={(e) => setGpsPrivacy(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Action */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 animate-scale-in">
              ✓ Preferences Saved
            </span>
          ) : <div />}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
