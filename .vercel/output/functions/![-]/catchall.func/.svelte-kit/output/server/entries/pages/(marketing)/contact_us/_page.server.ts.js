import { f as fail } from "../../../../chunks/index2.js";
import { s as sendAdminEmail } from "../../../../chunks/mailer.js";
const actions = {
  submitContactUs: async ({ request, locals: { supabaseServiceRole } }) => {
    const formData = await request.formData();
    const errors = {};
    const firstName = formData.get("first_name")?.toString() ?? "";
    if (firstName.length < 2) {
      errors["first_name"] = "First name is required";
    }
    if (firstName.length > 500) {
      errors["first_name"] = "First name too long";
    }
    const lastName = formData.get("last_name")?.toString() ?? "";
    if (lastName.length < 2) {
      errors["last_name"] = "Last name is required";
    }
    if (lastName.length > 500) {
      errors["last_name"] = "Last name too long";
    }
    const email = formData.get("email")?.toString() ?? "";
    if (email.length < 6) {
      errors["email"] = "Email is required";
    } else if (email.length > 500) {
      errors["email"] = "Email too long";
    } else if (!email.includes("@") || !email.includes(".")) {
      errors["email"] = "Invalid email";
    }
    const company = formData.get("company")?.toString() ?? "";
    if (company.length > 500) {
      errors["company"] = "Company too long";
    }
    const phone = formData.get("phone")?.toString() ?? "";
    if (phone.length > 100) {
      errors["phone"] = "Phone number too long";
    }
    const message = formData.get("message")?.toString() ?? "";
    if (message.length > 2e3) {
      errors["message"] = "Message too long (" + message.length + " of 2000)";
    }
    if (Object.keys(errors).length > 0) {
      return fail(400, { errors });
    }
    const { error: insertError } = await supabaseServiceRole.from("contact_requests").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      company_name: company,
      phone,
      message_body: message,
      updated_at: /* @__PURE__ */ new Date()
    });
    if (insertError) {
      console.error("Error saving contact request", insertError);
      return fail(500, { errors: { _: "Error saving" } });
    }
    await sendAdminEmail({
      subject: "New contact request",
      body: `New contact request from ${firstName} ${lastName}.

Email: ${email}

Phone: ${phone}

Company: ${company}

Message: ${message}`
    });
  }
};
export {
  actions
};
