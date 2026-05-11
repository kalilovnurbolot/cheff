const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } = require("docx");
const fs = require("fs");

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 400 },
    children: [new TextRun({ text, bold: true, size: 30, font: "Times New Roman" })]
  });
}
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 200, line: 360 },
    indent: { firstLine: 720 },
    children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
  });
}
function numbered(n, text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 150, line: 360 },
    indent: { left: 720, hanging: 360 },
    children: [new TextRun({ text: `${n}. ${text}`, size: 28, font: "Times New Roman" })]
  });
}
function gap() {
  return new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "" })] });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 28 }, paragraph: { spacing: { line: 360 } } }
    }
  },
  sections: [{
    children: [

      title("КОРУТУНДУ"),

      body("Диссертациялык иштин жыйынтыгы катары коюлган максат жана милдеттер толук ишке ашырылды деп ишеничтүү айтууга болот. PWA (Progressive Web Application) технологиясы кыйла терең изилденип, анын теориялык негиздери баяндалды, реалдуу долбоордо практикалык жүзүндө ишке ашырылды жана алынган натыйжалар системалуу түрдө талдалды."),

      body("Иштин жүрүшүндө төмөнкүдөй негизги жыйынтыктарга жетишилди:"),

      gap(),

      numbered(1, "PWA технологиясынын теориялык негиздерин изилдөө натыйжасында аныкталды: бул технология жалгыз бир курал эмес, Service Worker, Web App Manifest, Cache API, Push API сыяктуу бир нече заманбап веб-стандарттардын биримдиги. Алардын бирлешкен иши веб-тиркемелерге мурда мүмкүн болбогон нативдик функцияларды берет."),

      numbered(2, "Нативдик, гибриддик жана PWA тиркемелеринин салыштырмалуу талдоосунда PWA ресурстарды үнөмдөп, бир код базасы аркылуу кросс-платформалуулукту камсыз кылаарын көрсөттү. Нативдик тиркемелерге карата чектөөлөр (айрыкча iOS-та) дагы барлыгы аныкталды, бирок заманбап браузерлердин колдоосу жыл сайын кеңейүүдө."),

      numbered(3, "Реалдуу «Cheff» долбоорунда PWA технологиясы ийгиликтүү ишке ашырылды: Service Worker Workbox аркылуу конфигурацияланды, Web App Manifest орнотулду, тиркеме орнотуу функциясы ишке киргизилди, оффлайн режим жана Background Sync ишке ашырылды, push-билдирмелер интеграцияланды."),

      numbered(4, "Google Lighthouse аудитинин натыйжалары PWA оптимизациясынын таасирин сандык түрдө тастыктады: Performance баллы 54-тен 91-ге жетти (+68%), PWA баллы 100/100 болду. Тиркеменин жүктөлүү убактысы орточо 56% кыскарды."),

      numbered(5, "Кросс-браузердик тесттөө бардык заманбап браузерлерде (Chrome, Firefox, Safari, Edge, Samsung Internet) тиркеменин туура иштеерин тастыктады. Оффлайн тест сценарийлерининин баары ийгиликтүү өттү."),

      numbered(6, "Тармак трафик салыштырмасы: кэш механизми экинчи жолу кирүүдө 92.5% тармак трафикти кыскартты. Дисктеги өлчөм боюнча PWA нативдик Android тиркемесинен 88% кичине болду."),

      gap(),

      body("Иштин практикалык мааниси өзгөчө белгилөөгө татыктуу. Кыргызстандын веб-иштеп чыгуу индустриясы үчүн PWA — экономикалык жактан тиімдүү жол. Бир команда, бир код базасы, бир жайгаштыруу — бирок iOS, Android жана Desktop платформаларына бирдей жеткиликтүүлүк. Бул кичи жана орто бизнестерге нативдик тиркемелер иштеп чыгуу бюджетин кескин кыскартат."),

      body("Технологиянын келечеги жаркын. Web Bluetooth, Web NFC, File System Access API сыяктуу жаңы браузер API-лери PWA-нын аппараттык мүмкүнчүлүктөргө жетүүсүн дагы кеңейтүүдө. Apple компаниясы iOS Safari-де PWA функционалдуулугун тынымсыз жакшыртып жатат. 2024-2025-жылдарда PWA менен нативдик тиркемелердин ортосундагы айырма дагы да кичирейет деп болжолдоого болот."),

      body("Диссертациялык иштин натыйжалары Кыргызстандын IT индустриясында иштеген веб-иштеп чыгуучулар, стартап ишкерлери жана сандык продукт жаратууну пландаган уюмдар үчүн практикалык колдонмо катары пайдаланылышы мүмкүн."),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("korutundu.docx", buf);
  console.log("korutundu.docx ийгиликтүү түзүлдү!");
});
