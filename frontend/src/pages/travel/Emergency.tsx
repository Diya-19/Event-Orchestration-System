import { MapPin, Phone, Bell, AlertTriangle, Download, Check, IdCard, Clock, BatteryCharging, PhoneCall, Shield } from "lucide-react";

export default function EmergencyCard() {
  const addresses = [
    {
      title: "TI Main Building",
      address: "Tecsia Instruments, Tower D, Embassy Golf Links Business Park, Challaghatta, Bengaluru, Karnataka 560071",
      icon: MapPin
    },
    {
      title: "The Leela Palace, Bengaluru",
      address: "23, Old Airport Road, Bengaluru, Karnataka 560008",
      icon: MapPin
    },
    {
      title: "BLR Airport, Terminal 1",
      address: "Kempegowda International Airport, Bengaluru, Karnataka 560300",
      icon: MapPin
    }
  ];

  const contacts = [
    { name: "Hackathon Committee", phone: "+91 80 1234 5678", icon: PhoneCall },
    { name: "Transport - XYZ", phone: "+91 80 8765 4321", icon: PhoneCall },
    { name: "Hotel Front Desk", phone: "+91 80 2231 1234", icon: PhoneCall },
    { name: "Medical Emergency", phone: "+91 80 1122 3344", icon: AlertTriangle }
  ];

  const reminders = [
    { text: "Carry a valid ID proof", icon: IdCard },
    { text: "Reach pickup point 10 mins early", icon: Clock },
    { text: "Keep your phone charged", icon: BatteryCharging },
    { text: "Save emergency contacts", icon: Phone },
    { text: "Follow event guidelines", icon: Shield }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Card</h1>
        <p className="text-gray-600 mt-1">Important contacts and information for your safety</p>
      </div>

      {/* Logistics Pass Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center">
              <IdCard className="text-purple-600" size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Logistics Pass</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <Check size={12} className="mr-1" />
                  Works offline
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Download your pass and access important details anytime, anywhere.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition">
            <Download size={20} />
            Download Pass
          </button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Important Addresses */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <MapPin className="text-purple-600" size={20} />
            </div>
            <h3 className="font-semibold text-lg">Important Addresses</h3>
          </div>
          
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                <h4 className="font-semibold text-gray-900 mb-2">{addr.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{addr.address}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Phone className="text-green-600" size={20} />
            </div>
            <h3 className="font-semibold text-lg">Emergency Contacts</h3>
          </div>
          
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-3">
                  <contact.icon className="text-gray-400" size={18} />
                  <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                </div>
                <a href={`tel:${contact.phone}`} className="text-sm text-purple-700 font-semibold hover:text-purple-800">
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Important Reminders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Bell className="text-yellow-600" size={20} />
            </div>
            <h3 className="font-semibold text-lg">Important Reminders</h3>
          </div>
          
          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="text-purple-600" size={12} />
                </div>
                <span className="text-sm text-gray-700">{reminder.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-red-900 text-lg">Emergency Contact</h3>
          <p className="text-red-700 mt-1">
            In case of any emergency, contact the committee immediately at{" "}
            <a href="tel:+918012345678" className="font-bold underline hover:text-red-800">
              +91 80 1234 5678
            </a>
          </p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Quick Tips</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-800 text-xs font-bold">1</span>
            </div>
            <p className="text-sm text-blue-800">
              Keep this page bookmarked for quick access to emergency information
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-800 text-xs font-bold">2</span>
            </div>
            <p className="text-sm text-blue-800">
              Save all emergency numbers in your phone before traveling
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-800 text-xs font-bold">3</span>
            </div>
            <p className="text-sm text-blue-800">
              Download the logistics pass for offline access
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-800 text-xs font-bold">4</span>
            </div>
            <p className="text-sm text-blue-800">
              Always carry your ID proof and event badge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}