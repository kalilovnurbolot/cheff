const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopPosition, TabStopType, UnderlineType } = require("docx");
const fs = require("fs");

function p(left, right, bold = false, size = 28) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 120, line: 340 },
    children: [
      new TextRun({ text: left, bold, size, font: "Times New Roman" }),
      new TextRun({ text: right ? `\t${right}` : "", bold, size, font: "Times New Roman" })
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: 8640 }]
  });
}

function gap() {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "" })] });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 28 }, paragraph: { spacing: { line: 340 } } }
    }
  },
  sections: [{
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: "МАЗМУНУ", bold: true, size: 32, font: "Times New Roman" })]
      }),

      p("Киришүү", "3", true),
      gap(),

      p("I БӨЛҮМ. PWA ТЕХНОЛОГИЯСЫНЫН ТЕОРИЯЛЫК НЕГИЗДЕРИ", "6", true),
      p("1.1. Веб-тиркемелердин өнүгүү тарыхы", "6"),
      p("    1.1.1. Нативдик, гибриддик жана PWA тиркемелеринин айырмасы", "7"),
      p("    1.1.2. PWA концепциясынын пайда болушу", "8"),
      p("1.2. PWA-нын негизги технологиялары", "9"),
      p("    1.2.1. Service Worker — иштөө принциби", "9"),
      p("    1.2.2. Web App Manifest", "11"),
      p("    1.2.3. HTTPS талабы", "12"),
      p("    1.2.4. Cache API жана оффлайн режими", "13"),
      p("1.3. PWA-нын артыкчылыктары жана кемчиликтери", "15"),
      p("1.4. Дүйнөлүк практикадагы PWA колдонуу мисалдары", "17"),
      gap(),

      p("II БӨЛҮМ. ПРАКТИКАЛЫК ЖҮЗҮНДӨ КӨРСӨТҮҮ", "19", true),
      p("2.1. Долбоордун техникалык мүнөздөмөсү", "19"),
      p("    2.1.1. Долбоордун максаты жана колдонуучулар аудиториясы", "19"),
      p("    2.1.2. Колдонулган технологиялар стеки", "20"),
      p("    2.1.3. Архитектуранын сүрөттөлүшү", "21"),
      p("2.2. Service Worker-ди ишке ашыруу", "22"),
      p("    2.2.1. Каттоо (Registration)", "22"),
      p("    2.2.2. Кэштөө стратегиялары", "23"),
      p("    2.2.3. Push-билдирмелерди ишке ашыруу", "25"),
      p("2.3. Web App Manifest конфигурациясы", "26"),
      p("2.4. Тиркемени орнотуу мүмкүнчүлүгү (Installability)", "28"),
      p("2.5. Оффлайн режиминин иштешин көрсөтүү", "29"),
      gap(),

      p("III БӨЛҮМ. СИСТЕМАНЫ ТЕСТТӨӨ, ТАЛДОО ЖАНА ЖЫЙЫНТЫКТОО", "31", true),
      p("3.1. Google Lighthouse аркылуу аудит", "31"),
      p("    3.1.1. Performance баллы", "31"),
      p("    3.1.2. PWA Checklist текшерүү", "33"),
      p("    3.1.3. Accessibility жана SEO баллдары", "34"),
      p("3.2. Оффлайн режимди тесттөө", "35"),
      p("3.3. Кросс-браузердик тесттөө", "36"),
      p("3.4. Өндүрүмдүүлүк талдоосу", "37"),
      p("3.5. Коопсуздук талдоосу", "39"),
      gap(),

      p("Корутунду", "41", true),
      p("Колдонулган адабияттар", "43", true),
      p("Тиркемелер", "45", true),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("mazmunu.docx", buf);
  console.log("mazmunu.docx ийгиликтүү түзүлдү!");
});
