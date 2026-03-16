import React from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-y-auto">
      <div className="max-w-3xl mx-auto py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 hover:bg-zinc-800 text-zinc-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to App
          </Button>
        </Link>
        
        <div className="p-8 border rounded-lg bg-zinc-900 border-zinc-800 shadow-2xl backdrop-blur-sm">
          <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 mb-8 border-b border-zinc-800 pb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
              <p>
                Welcome to SoloLvlUp ("Application", "we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your data when you use our Application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">2. Data Processing & Offline Storage</h2>
              <p className="mb-2">
                <strong>SoloLvlUp is designed as a secure, offline-first application.</strong> 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All your quest data, RPG statistics, personal reflections, and diary entries are stored <strong>locally on your device</strong> using secure internal storage.</li>
                <li>We do not transmit your local RPG data to external servers without your explicit action.</li>
                <li>If you choose to use features powered by AI (such as Gemini integrations), only the necessary text prompts are sent securely to Google's Gemini API to generate responses. These interactions are subject to Google's Privacy Policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">3. Device Permissions</h2>
              <p>Our application requests minimal device permissions necessary for core functionality:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Local Notifications:</strong> To provide daily quest reminders and level-up alerts. We do not use push notifications from external servers.</li>
                <li><strong>Internet Action:</strong> To fetch AI-generated analysis if you explicitly use the AI features.</li>
              </ul>
              <p className="mt-2 text-sm text-zinc-400"><em>Note: We do not request access to your contacts, precise location, camera, or microphone.</em></p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">4. Data Deletion</h2>
              <p>
                Because your RPG data is stored locally on your device, you have complete control over it. You can delete all your data instantly by utilizing the "Reset Progress" feature inside the Application's settings, or by uninstalling the application from your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">5. Children's Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-white">6. Changes to this Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
              </p>
            </section>

            <section className="bg-zinc-950 p-6 rounded-lg mt-8 border border-zinc-800">
              <h2 className="text-xl font-bold mb-2 text-white">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or your data, please contact the developer via the official support channels provided in the app store listing.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
