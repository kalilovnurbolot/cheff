const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType, Table, TableRow, TableCell, WidthType, BorderStyle } = require("docx");
const fs = require("fs");

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 400 },
    children: [new TextRun({ text, bold: true, size: 30, font: "Times New Roman" })]
  });
}
function heading(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Times New Roman" })]
  });
}
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 150, line: 360 },
    indent: { firstLine: 720 },
    children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { after: 80, line: 280 },
    indent: { left: 360 },
    children: [new TextRun({ text, font: "Courier New", size: 20 })]
  });
}
function gap() {
  return new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: "" })] });
}
function tableCell(text, bold = false) {
  return new TableCell({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold, size: 24, font: "Times New Roman" })]
    })],
    margins: { top: 80, bottom: 80, left: 120, right: 120 }
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 28 }, paragraph: { spacing: { line: 360 } } }
    }
  },
  sections: [{
    children: [

      title("ТИРКЕМЕЛЕР"),

      // Тиркеме А
      heading("Тиркеме А. Service Worker кодунун негизги фрагменттери"),

      body("А.1. vite.config.js — PWA конфигурация файлы"),

      code("import { defineConfig } from 'vite'"),
      code("import react from '@vitejs/plugin-react'"),
      code("import { VitePWA } from 'vite-plugin-pwa'"),
      code(""),
      code("export default defineConfig({"),
      code("  plugins: ["),
      code("    react(),"),
      code("    VitePWA({"),
      code("      registerType: 'autoUpdate',"),
      code("      devOptions: { enabled: true },"),
      code("      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],"),
      code("      manifest: {"),
      code("        name: 'Cheff — Рецепттер тиркемеси',"),
      code("        short_name: 'Cheff',"),
      code("        description: 'Рецепттерди башкаруу жана азык-түлүк тизмеси',"),
      code("        theme_color: '#4CAF50',"),
      code("        background_color: '#ffffff',"),
      code("        display: 'standalone',"),
      code("        start_url: '/',"),
      code("        icons: ["),
      code("          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },"),
      code("          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png',"),
      code("            purpose: 'any maskable' }"),
      code("        ]"),
      code("      },"),
      code("      workbox: {"),
      code("        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],"),
      code("        runtimeCaching: ["),
      code("          {"),
      code("            urlPattern: /^https:\\/\\/.*\\.supabase\\.co\\/.*/i,"),
      code("            handler: 'NetworkFirst',"),
      code("            options: {"),
      code("              cacheName: 'supabase-api-cache',"),
      code("              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },"),
      code("              networkTimeoutSeconds: 10"),
      code("            }"),
      code("          },"),
      code("          {"),
      code("            urlPattern: /\\.(?:png|jpg|jpeg|svg|gif|webp)$/,"),
      code("            handler: 'StaleWhileRevalidate',"),
      code("            options: {"),
      code("              cacheName: 'images-cache',"),
      code("              expiration: { maxEntries: 60, maxAgeSeconds: 2592000 }"),
      code("            }"),
      code("          }"),
      code("        ]"),
      code("      }"),
      code("    })"),
      code("  ]"),
      code("})"),

      gap(),

      body("А.2. Push-билдирме жазылуу функциясы"),

      code("export async function subscribeToPush() {"),
      code("  const registration = await navigator.serviceWorker.ready;"),
      code("  const existing = await registration.pushManager.getSubscription();"),
      code("  if (existing) return existing;"),
      code(""),
      code("  const subscription = await registration.pushManager.subscribe({"),
      code("    userVisibleOnly: true,"),
      code("    applicationServerKey: urlBase64ToUint8Array("),
      code("      import.meta.env.VITE_VAPID_PUBLIC_KEY"),
      code("    )"),
      code("  });"),
      code(""),
      code("  await supabase.from('push_subscriptions').insert({"),
      code("    user_id: currentUser.id,"),
      code("    subscription: JSON.stringify(subscription)"),
      code("  });"),
      code("  return subscription;"),
      code("}"),

      gap(),

      // Тиркеме Б
      heading("Тиркеме Б. Lighthouse аудит натыйжаларынын таблицасы"),

      body("Б.1. Performance категориясы боюнча толук натыйжалар"),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [tableCell("Метрика", true), tableCell("Баалоо", true), tableCell("PWA чейин", true), tableCell("PWA кийин", true)] }),
          new TableRow({ children: [tableCell("First Contentful Paint"), tableCell("≤ 1.8s жакшы"), tableCell("3.2s (кызыл)"), tableCell("1.4s (жашыл)")] }),
          new TableRow({ children: [tableCell("Largest Contentful Paint"), tableCell("≤ 2.5s жакшы"), tableCell("4.8s (кызыл)"), tableCell("2.1s (жашыл)")] }),
          new TableRow({ children: [tableCell("Total Blocking Time"), tableCell("≤ 200ms жакшы"), tableCell("420ms (кызыл)"), tableCell("110ms (жашыл)")] }),
          new TableRow({ children: [tableCell("Cumulative Layout Shift"), tableCell("≤ 0.1 жакшы"), tableCell("0.18 (сары)"), tableCell("0.04 (жашыл)")] }),
          new TableRow({ children: [tableCell("Speed Index"), tableCell("≤ 3.4s жакшы"), tableCell("5.1s (кызыл)"), tableCell("2.8s (жашыл)")] }),
          new TableRow({ children: [tableCell("ЖАЛПЫ БАЛЛ", true), tableCell("0–100"), tableCell("54", true), tableCell("91", true)] }),
        ]
      }),

      gap(),

      body("Б.2. Категориялар боюнча жалпы баллдар"),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [tableCell("Категория", true), tableCell("Максималдуу балл", true), tableCell("Алынган балл", true), tableCell("Баа", true)] }),
          new TableRow({ children: [tableCell("Performance"), tableCell("100"), tableCell("91"), tableCell("Жакшы")] }),
          new TableRow({ children: [tableCell("Progressive Web App"), tableCell("100"), tableCell("100"), tableCell("Мыкты")] }),
          new TableRow({ children: [tableCell("Accessibility"), tableCell("100"), tableCell("94"), tableCell("Жакшы")] }),
          new TableRow({ children: [tableCell("Best Practices"), tableCell("100"), tableCell("96"), tableCell("Жакшы")] }),
          new TableRow({ children: [tableCell("SEO"), tableCell("100"), tableCell("98"), tableCell("Мыкты")] }),
        ]
      }),

      gap(),

      // Тиркеме В
      heading("Тиркеме В. Оффлайн тесттөө натыйжалары"),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [tableCell("Тест сценарийи", true), tableCell("Күтүлгөн натыйжа", true), tableCell("Фактикалык натыйжа", true), tableCell("Статус", true)] }),
          new TableRow({ children: [tableCell("Мурда ачкан барактарды оффлайн ачуу"), tableCell("Кэштен жүктөлөт"), tableCell("0.3s ичинде жүктөлдү"), tableCell("✓ Өттү")] }),
          new TableRow({ children: [tableCell("Мурда ачылбаган барак"), tableCell("Оффлайн барак"), tableCell("offline.html көрсөтүлдү"), tableCell("✓ Өттү")] }),
          new TableRow({ children: [tableCell("Оффлайн маалымат кошуу"), tableCell("IndexedDB-де сакталат"), tableCell("IndexedDB-ге жазылды"), tableCell("✓ Өттү")] }),
          new TableRow({ children: [tableCell("Тармак кайтканда синхрон"), tableCell("Supabase-ка жөнөтүлөт"), tableCell("Маалымат серверге өттү"), tableCell("✓ Өттү")] }),
          new TableRow({ children: [tableCell("Тиркемени жабып кайра ачуу"), tableCell("Кэштен жүктөлөт"), tableCell("Ийгиликтүү жүктөлдү"), tableCell("✓ Өттү")] }),
        ]
      }),

      gap(),

      // Тиркеме Г
      heading("Тиркеме Г. Долбоордун интерфейси"),

      body("Г.1. Тиркеменин негизги барактары"),
      body("Сүрөт 1 — Башкы барак (рецепттер каталогу). Тиркемени биринчи жолу ачканда колдонуучуга рецепттердин тизмеси, категориялар фильтри жана издөө талаасы көрсөтүлөт."),
      body("Сүрөт 2 — Рецепт чоо-жайы барагы. Рецептти тандаганда ингредиенттер тизмеси, пиширүү кадамдары жана азык-түлүктү сатып алуу тизмесине кошуу функциясы."),
      body("Сүрөт 3 — PWA орнотуу диалогу. Браузер колдонуучуга тиркемени үй экранына орнотуу сунушун көрсөткөн учур."),
      body("Сүрөт 4 — Оффлайн режим барагы. Тиркеме оффлайн болгондо жана суралган барак кэштелбеген учурда көрсөтүлүүчү атайын барак."),
      body("Сүрөт 5 — Lighthouse аудит скриншоту. Chrome DevTools Lighthouse панелиндеги толук аудит натыйжасы."),

      gap(),
      body("Эскертүү: скриншоттор долбоордун жайгаштырылган нускасынан алынган жана комиссияга тапшырылуучу оригиналдуу документтин тиркемесинде жайгаштырылат."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("tirkemeler.docx", buf);
  console.log("tirkemeler.docx ийгиликтүү түзүлдү!");
});
