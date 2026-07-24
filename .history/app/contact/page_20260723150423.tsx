import ContactAdminForm from "@/components/ui/ContactAdminForm";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-10 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Admin</h1>
        <p className="text-gray-600 mb-8">
          Send your phone number, email, and a short message. The admin team will
          respond as soon as possible.
        </p>
        <ContactAdminForm />
      </div>
    </div>
  );
}
