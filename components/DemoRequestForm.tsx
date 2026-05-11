import { submitDemoRequest } from "@/app/actions/submit-demo-request";

export function DemoRequestForm() {
  return (
    <form
      action={submitDemoRequest}
      className="mx-auto max-w-xl space-y-4 text-left"
    >
      <div>
        <label htmlFor="practiceName" className="mb-1 block text-sm font-semibold">
          Practice name
        </label>
        <input
          id="practiceName"
          name="practiceName"
          type="text"
          required
          autoComplete="organization"
          className="w-full rounded-lg border border-[#1B3A5B]/20 bg-white px-4 py-2 text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="contactName" className="mb-1 block text-sm font-semibold">
          Contact name
        </label>
        <input
          id="contactName"
          name="contactName"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-[#1B3A5B]/20 bg-white px-4 py-2 text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-[#1B3A5B]/20 bg-white px-4 py-2 text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="operatories" className="mb-1 block text-sm font-semibold">
          # of operatories
        </label>
        <input
          id="operatories"
          name="operatories"
          type="number"
          min={1}
          step={1}
          className="w-full rounded-lg border border-[#1B3A5B]/20 bg-white px-4 py-2 text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full resize-y rounded-lg border border-[#1B3A5B]/20 bg-white px-4 py-2 text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
        />
      </div>
      <div className="pt-2 text-center">
        <button
          type="submit"
          className="inline-block rounded-full bg-[#E85A9B] px-8 py-3 font-semibold text-white hover:opacity-90"
        >
          Send demo request
        </button>
      </div>
    </form>
  );
}
