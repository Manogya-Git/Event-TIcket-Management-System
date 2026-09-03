/* cspell:ignore kgarira chargebacks Garira arira */

const TermsAnd = () => {
  const sections = [
    {
      title: "Rights of Admission Reserved",
      text: "KGarira.com and event organizers reserve the right to refuse entry or remove any individual from an event without providing a reason. This decision is at the discretion of the event organizers and is final.",
    },
    {
      title: "Valid Government-Issued ID",
      text: "All attendees must present a valid government-issued photo ID on the event day. Failure to provide identification may result in denied entry without a refund.",
    },
    {
      title: "Non-refundable and Non-transferable Tickets",
      text: "Tickets purchased through KGarira.com are non-refundable and non-transferable unless the event is canceled by the organizer. In that case, refunds will be handled according to the organizer's refund policy.",
    },
    {
      title: "Personal Responsibility",
      text: "Ticket buyers are solely responsible for themselves and their dependents while attending events. Attendees should exercise caution, follow event rules, and observe all safety guidelines.",
    },
    {
      title: "Liability and Indemnity",
      text: "KGarira.com and its event partners are not liable for claims, damages, losses, injuries, or unforeseen incidents during an event. Attendees acknowledge that they attend events at their own risk.",
    },
    {
      title: "Security and Searches",
      text: "Event organizers may conduct security checks on all persons and property before entry. Refusal to consent to a search may result in denied entry.",
    },
    {
      title: "Event Changes",
      text: "Dates, times, venues, and performers may change. KGarira.com and event organizers will strive to notify ticket holders using the contact information provided at purchase.",
    },
  ];

  return (
    <div style={{ background: "#f7f8fc", minHeight: "100vh", color: "#172033", fontFamily: "Inter, Arial, sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg, #111b3d, #293a83)", color: "white", padding: "72px 24px 88px" }}>
        <div style={{ maxWidth: 1050, margin: "auto" }}>
          <div style={{ color: "#aabaff", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontSize: 12 }}>KGarira.com</div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 58px)", margin: "18px 0 12px", lineHeight: 1.05 }}>Terms &amp; Conditions</h1>
          <p style={{ color: "#d8defa", margin: 0, fontSize: 16 }}>Please read these terms carefully before using our ticketing platform.</p>
        </div>
      </header>
      <main style={{ maxWidth: 1050, margin: "-38px auto 0", padding: "0 24px 64px", position: "relative" }}>
        <section style={{ background: "white", borderRadius: 16, padding: "28px clamp(22px, 5vw, 52px)", boxShadow: "0 12px 35px rgba(25,35,75,.09)", lineHeight: 1.75, fontSize: 15 }}>
          <p style={{ color: "#68728a", fontSize: 13, fontWeight: 700, marginTop: 0 }}>LAST UPDATED · 10 FEBRUARY, 2023</p>
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>Introduction</h2>
          <p>This agreement sets out the terms and conditions governing your access to the KGarira website and services. By clicking “Buy Ticket” or using our Electronic Channels, you confirm that you have read, understood, and agreed to these terms.</p>
          <p>Welcome to KGarira.com, the online ticketing platform providing access to events and experiences. If you do not agree with these terms, please do not use our platform or services.</p>
          <div style={{ borderTop: "1px solid #e9ecf3", margin: "28px 0" }} />
          <h2 style={{ fontSize: 24 }}>Event policies</h2>
          {sections.map((section) => <article key={section.title} style={{ marginTop: 22 }}><h3 style={{ color: "#293a83", fontSize: 17, margin: 0 }}>{section.title}</h3><p style={{ margin: "5px 0 0", color: "#59647a" }}>{section.text}</p></article>)}
          <article style={{ marginTop: 22 }}><h3 style={{ color: "#293a83", fontSize: 17 }}>Intellectual Property, Privacy &amp; Governing Law</h3><p style={{ margin: "5px 0 0", color: "#59647a" }}>Content on KGarira.com is protected by intellectual property laws. Please refer to our Privacy Policy for information about your personal data. These terms are governed by the laws of the jurisdiction in which KGarira.com operates.</p></article>
          <article style={{ marginTop: 22 }}><h3 style={{ color: "#293a83", fontSize: 17 }}>Modification of Terms</h3><p style={{ margin: "5px 0 0", color: "#59647a" }}>KGarira.com may modify these terms at any time. Changes become effective when posted on the website, so please review them periodically.</p></article>
        </section>
      </main>
    </div>
  );
};

export default TermsAnd;
