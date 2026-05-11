const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, spacing, UnderlineType
} = require("docx");
const fs = require("fs");

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 28 },
        paragraph: { spacing: { line: 360 } }
      }
    }
  },
  sections: [{
    properties: {},
    children: [

      // БАШКЫ АТАЛЫШ
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "КИРИШҮҮ",
            bold: true,
            size: 32,
            font: "Times New Roman"
          })
        ]
      }),

      // Актуалдуулук
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Темасынын актуалдуулугу",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 200, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Заманбап цифралык дүйнөдө колдонуучулар тиркемелерге тез, ишенимдүү жана ыңгайлуу мүмкүнчүлүк алууну талап кылат. Нативдик мобилдик тиркемелер жогорку өндүрүмдүүлүктү камсыз кылса да, аларды иштеп чыгуу жана жайылтуу олуттуу убакытты, каражатты жана техникалык ресурстарды талап кылат. Ошол эле учурда кадимки веб-тиркемелер оффлайн режиминде иштей алbaй, push-билдирмелерди жөнөтүү мүмкүнчүлүгүнөн ажыраган бойдон кала берет.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 200, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Ушул эки дүйнөнүн ортосундагы ажырымды жоюу максатында ",
            size: 28,
            font: "Times New Roman"
          }),
          new TextRun({
            text: "Progressive Web Application (PWA)",
            bold: true,
            size: 28,
            font: "Times New Roman"
          }),
          new TextRun({
            text: " — Прогрессивдик Веб-Тиркеме технологиясы пайда болду. PWA — бул заманбап веб-технологиялардын негизинде курулган, нативдик тиркемелерге мүнөздүү өзгөчөлүктөрдү (оффлайн иштөө, орнотуу мүмкүнчүлүгү, push-билдирмелер, тез жүктөлүү) колдонуучуга сунуштай алган веб-тиркемелердин жаңы муундагы тиби.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 200, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "2015-жылы Google компаниясынын инженери Алекс Рассел тарабынан киргизилген бул концепция, бүгүнкү күндө дүйнөнүн алдыңкы IT-компаниялары тарабынан кеңири колдонулуп жатат. Twitter Lite, Alibaba, Starbucks, Pinterest сыяктуу платформалар PWA технологиясына өткөндөн кийин колдонуучулардын активдүүлүгү 2–4 эсе өсүп, трафик чыгымдары кескин кыскарганын статистика тастыктайт.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 400, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Кыргызстандын цифралык экономикасынын өнүгүшү менен бирге жергиликтүү иштеп чыгуучулар да ресурс талап кылбаган, бирок функционалдуулугу жогору болгон тиркемелерди жаратуунун жолдорун издеп жатат. Бул контекстте PWA технологиясын изилдөө жана аны иш жүзүндө колдонуу масаласы өзгөчө актуалдуу мааниге ээ болуп саналат.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      // Максаты
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Изилдөөнүн максаты",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 400, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Бул иштин негизги максаты — Progressive Web Application (PWA) технологиясынын теориялык негиздерин изилдеп, анын практикалык ишке ашырылышын реалдуу долбоордун мисалында көрсөтүү жана алынган натыйжаларды системалуу талдоо аркылуу технологиянын натыйжалуулугун баалоо.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      // Милдеттер
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Изилдөөнүн милдеттери",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 100, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Коюлган максатка жетишүү үчүн төмөнкүдөй милдеттер аныкталды:",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      ...[
        "1. PWA технологиясынын концептуалдык негиздерин, тарыхын жана өнүгүү багыттарын изилдөө;",
        "2. Service Worker, Web App Manifest, Cache API жана башка PWA компоненттеринин иштөө принциптерин талдоо;",
        "3. PWA менен нативдик жана кадимки веб-тиркемелерди салыштырмалуу талдоодон өткөрүү;",
        "4. Реалдуу долбоордо PWA технологиясын ишке ашыруу — оффлайн режим, орнотуу функциясы жана push-билдирмелерди интеграциялоо;",
        "5. Google Lighthouse жана башка куралдар аркылуу тиркеменин сапатын өлчөп, натыйжаларды системалуу баалоо;",
        "6. Алынган тажрыйбанын негизинде практикалык сунуштарды иштеп чыгуу."
      ].map(text => new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 100, line: 360 },
        indent: { left: 720 },
        children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
      })),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "" })] }),

      // Объект
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Изилдөөнүн объектиси",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 400, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Изилдөөнүн объектиси болуп — заманбап веб-тиркемелерди иштеп чыгуу процессинде колдонулган ",
            size: 28,
            font: "Times New Roman"
          }),
          new TextRun({
            text: "Progressive Web Application (PWA)",
            bold: true,
            size: 28,
            font: "Times New Roman"
          }),
          new TextRun({
            text: " технологиясы саналат.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      // Предмет
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Изилдөөнүн предмети",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 400, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Изилдөөнүн предмети болуп — PWA технологиясынын негизги компоненттери: ",
            size: 28,
            font: "Times New Roman"
          }),
          new TextRun({
            text: "Service Worker, Web App Manifest, Cache API,",
            bold: true,
            size: 28,
            font: "Times New Roman"
          }),
          new TextRun({
            text: " оффлайн режим жана тиркеме өндүрүмдүүлүгүнүн өлчөм көрсөткүчтөрү саналат.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      // Методдор
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Изилдөөнүн методдору",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 100, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Иштин жүрүшүндө төмөнкүдөй изилдөө методдору колдонулду:",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 100, line: 360 },
        indent: { left: 720 },
        children: [
          new TextRun({ text: "— ", size: 28, font: "Times New Roman" }),
          new TextRun({ text: "Теориялык методдор:", bold: true, size: 28, font: "Times New Roman" }),
          new TextRun({ text: " илимий адабияттарды жана техникалык документацияларды анализдөө, синтез, салыштырмалуу талдоо;", size: 28, font: "Times New Roman" })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 400, line: 360 },
        indent: { left: 720 },
        children: [
          new TextRun({ text: "— ", size: 28, font: "Times New Roman" }),
          new TextRun({ text: "Практикалык методдор:", bold: true, size: 28, font: "Times New Roman" }),
          new TextRun({ text: " программалык коддоо, функционалдык тесттөө, өндүрүмдүүлүктү өлчөө, эксперименттик изилдөө.", size: 28, font: "Times New Roman" })
        ]
      }),

      // Практикалык маанилүүлүк
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Иштин практикалык маанилүүлүгү",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 400, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Иштин практикалык маанилүүлүгү — алынган натыйжалар жана иштеп чыгылган долбоор реалдуу бизнес жагдайында колдонулушу мүмкүн. Иштеп чыгуучулар жана ишкерлер үчүн бул изилдөө нативдик тиркемелерге балама катары PWA технологиясын колдонуунун аныкталган артыкчылыктарын жана ишке ашыруунун практикалык жолдорун сунуштайт.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      // Структура
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Иштин структурасы",
            bold: true,
            underline: { type: UnderlineType.SINGLE },
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 200, line: 360 },
        indent: { firstLine: 720 },
        children: [
          new TextRun({
            text: "Диссертациялык иш киришүүдөн, үч негизги бөлүмдөн, корутундудан, колдонулган адабияттар тизмесинен жана тиркемелерден турат.",
            size: 28,
            font: "Times New Roman"
          })
        ]
      }),

      ...[
        "Биринчи бөлүмдө PWA технологиясынын теориялык негиздери, тарыхы жана техникалык компоненттери каралат.",
        "Экинчи бөлүмдө реалдуу долбоордо PWA-ны практикалык ишке ашыруу баяндалат.",
        "Үчүнчү бөлүмдө тиркеменин тестирлөө жана аудит натыйжалары талдалып, жыйынтыктар чыгарылат."
      ].map(text => new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: 150, line: 360 },
        indent: { firstLine: 720 },
        children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
      }))
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("kirishuu.docx", buffer);
  console.log("kirishuu.docx ийгиликтүү түзүлдү!");
});
