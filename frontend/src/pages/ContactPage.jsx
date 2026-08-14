import { useState } from "react";
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { sendContactMessage } from "../services/api";

import lagoonImage from "../assets/lagune-dakhla.jpg";

const EMPTY_FORM = {
  firstname: "",
  lastname: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const data = await sendContactMessage(form);

      setSuccess(
        data.message ??
          "Votre message a bien été envoyé."
      );

      setForm(EMPTY_FORM);
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible d’envoyer votre message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <Header />

      <section
        className="inner-hero contact-page-hero"
        style={{
          backgroundImage: `url(${lagoonImage})`,
        }}
      >
        <div className="inner-hero-overlay" />

        <div className="inner-hero-content">
          <span>
            <MessageCircle size={17} />
            Nous contacter
          </span>

          <h1>Parlons de votre projet à Dakhla</h1>

          <p>
            Une question, une suggestion ou une adresse à
            nous faire découvrir ? Écrivez-nous.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-information">
          <span className="section-label">
            Dakhla Place
          </span>

          <h2>Nous sommes à votre écoute</h2>

          <p>
            Utilisez ce formulaire pour nous poser une
            question, proposer une adresse ou nous
            signaler une information à mettre à jour.
          </p>

          <div className="contact-information-list">
            <article>
              <span>
                <Mail size={21} />
              </span>

              <div>
                <strong>Par e-mail</strong>
                <p>
                  Nous répondons dès que possible à chaque
                  demande.
                </p>
              </div>
            </article>

            <article>
              <span>
                <MapPin size={21} />
              </span>

              <div>
                <strong>À Dakhla</strong>
                <p>
                  Région de Dakhla-Oued Ed-Dahab, Maroc.
                </p>
              </div>
            </article>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="contact-form-heading">
            <span>Votre message</span>
            <h2>Comment pouvons-nous vous aider ?</h2>
          </div>

          {error && (
            <div
              className="contact-form-message error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="contact-form-message success"
              role="status"
            >
              <CheckCircle2 size={19} />
              {success}
            </div>
          )}

          <div className="contact-form-grid">
            <label>
              Prénom *
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </label>

            <label>
              Nom
              <input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                maxLength={100}
              />
            </label>

            <label className="full">
              Adresse e-mail *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                maxLength={180}
                required
              />
            </label>

            <label className="full">
              Objet *
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </label>

            <label className="full">
              Message *
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                minLength={10}
                maxLength={5000}
                rows={8}
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={sending}
          >
            {sending
              ? "Envoi en cours…"
              : "Envoyer le message"}

            <Send size={18} />
          </button>
        </form>
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}