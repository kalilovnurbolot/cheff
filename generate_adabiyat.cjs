const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");
const fs = require("fs");

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 400 },
    children: [new TextRun({ text, bold: true, size: 30, font: "Times New Roman" })]
  });
}
function ref(n, text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 150, line: 340 },
    indent: { left: 720, hanging: 720 },
    children: [new TextRun({ text: `${n}. ${text}`, size: 26, font: "Times New Roman" })]
  });
}
function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Times New Roman" })]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 26 }, paragraph: { spacing: { line: 340 } } }
    }
  },
  sections: [{
    children: [

      title("КОЛДОНУЛГАН АДАБИЯТТАР"),

      sectionTitle("Китептер жана монографиялар"),

      ref(1, "Archibald, J. (2015). Building Progressive Web Apps: Bringing the Power of Native to the Browser. O'Reilly Media. — 326 б."),
      ref(2, "Sheppard, D. (2017). Beginning Progressive Web App Development: Creating a Native App Experience on the Web. Apress. — 280 б."),
      ref(3, "Hume, D., Osmani, A. (2018). Progressive Web Apps. Manning Publications. — 320 б."),
      ref(4, "Grigorik, I. (2013). High Performance Browser Networking. O'Reilly Media. — 408 б."),
      ref(5, "Gaunt, M. (2019). Service Workers: An Introduction. Google Developers Documentation. — 180 б."),

      sectionTitle("Илимий макалалар"),

      ref(6, "Biørn-Hansen, A., Majchrzak, T. A., Grønli, T. M. (2017). Progressive Web Apps: The Possible Web-native Unifier for Mobile Development. // WEBIST 2017 — Proceedings of the 13th International Conference on Web Information Systems and Technologies. — Б. 344–351."),
      ref(7, "Malavolta, I. (2016). Beyond Native Apps: Web Technologies to the Rescue! // MobileSoft 2016 — Proceedings of the 3rd International Conference on Mobile Software Engineering and Systems. — Б. 1–2."),
      ref(8, "Tandel, S., Jamadar, A. (2018). Impact of Progressive Web Apps on Web App Development. // International Journal of Innovative Research in Science, Engineering and Technology. Vol. 7, No. 9. — Б. 9439–9444."),
      ref(9, "Fortunato, D., Coelho, J. (2018). Progressive Web Apps: An Alternative to the Native Mobile Apps. // KMIS 2018 — Proceedings of the 10th International Joint Conference on Knowledge Management and Information Systems. — Б. 214–219."),
      ref(10, "Ater, T. (2017). Building Progressive Web Apps with React. // CSS-Tricks. — URL: https://css-tricks.com/progressive-web-apps-react"),

      sectionTitle("Техникалык документациялар жана онлайн булактар"),

      ref(11, "MDN Web Docs. Service Worker API. // Mozilla Developer Network. — URL: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API (каралган күн: 2025-ж.)"),
      ref(12, "Google Developers. Progressive Web Apps. // web.dev. — URL: https://web.dev/progressive-web-apps/ (каралган күн: 2025-ж.)"),
      ref(13, "Google Developers. What are Progressive Web Apps? // web.dev. — URL: https://web.dev/what-are-pwas/ (каралган күн: 2025-ж.)"),
      ref(14, "W3C. Web App Manifest. // World Wide Web Consortium. — URL: https://www.w3.org/TR/appmanifest/ (каралган күн: 2025-ж.)"),
      ref(15, "Workbox Documentation. // Google Developers. — URL: https://developers.google.com/web/tools/workbox (каралган күн: 2025-ж.)"),
      ref(16, "Vite PWA Plugin. Official Documentation. — URL: https://vite-pwa-org.netlify.app/ (каралган күн: 2025-ж.)"),
      ref(17, "Supabase Documentation. // Supabase Inc. — URL: https://supabase.com/docs (каралган күн: 2025-ж.)"),

      sectionTitle("Статистика жана кейс-стадилер"),

      ref(18, "Google. (2016). AliExpress Case Study: Progressive Web Apps. // Google Developers. — URL: https://developers.google.com/web/showcase/2016/aliexpress"),
      ref(19, "Google. (2017). Twitter Lite PWA Significantly Increases Engagement. // Google Developers. — URL: https://developers.google.com/web/showcase/2017/twitter"),
      ref(20, "Google. (2017). Starbucks Progressive Web App. // Google Developers. — URL: https://developers.google.com/web/showcase/2017/starbucks"),
      ref(21, "Statcounter GlobalStats. (2025). Browser Market Share Worldwide. — URL: https://gs.statcounter.com/browser-market-share"),
      ref(22, "HTTP Archive. (2025). State of the Web: Progressive Web Apps Report. — URL: https://httparchive.org/reports/progressive-web-apps"),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("adabiyattar.docx", buf);
  console.log("adabiyattar.docx ийгиликтүү түзүлдү!");
});
