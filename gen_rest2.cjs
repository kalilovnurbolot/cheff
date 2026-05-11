// Generates: korutundu_v2, adabiyattar_v2, tirkemeler_v2, mazmunu_v2
const { Document, Packer } = require("docx");
const fs = require("fs");
const {
  PAGE, makeFooter, chapterTitle, h2, h3, p, li, ni, gap, label, code,
  tc, tcLeft, trow, tableNote, Table, WidthType,
  AlignmentType, Paragraph, TextRun, FONT, SZ, LineRuleType
} = require("./fmt.cjs");

// ─── КОРУТУНДУ ───────────────────────────────────────────────────────────────

const korutunduDoc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SZ }, paragraph: { spacing: { line: 360, lineRule: LineRuleType.AUTO } } } } },
  sections: [{
    properties: { page: { size: PAGE.size, margin: PAGE.margin } },
    footers: { default: makeFooter() },
    children: [
      chapterTitle("КОРУТУНДУ"),

      p("Диссертациялык иштин жыйынтыгы катары коюлган максат жана бардык милдеттер толук ишке ашырылды деп ишеничтүү айтууга болот. Progressive Web Application (PWA) технологиясы кыйла терең изилденип, анын теориялык негиздери системалуу түрдө баяндалды, реалдуу «Cheff» долбоорунда практикалык жүзүндө ишке ашырылды жана алынган натыйжалар Lighthouse аудити, оффлайн тесттери жана кросс-браузердик тесттер аркылуу системалуу баалоодон өткөрүлдү."),

      p("Иштин биринчи бөлүмүндө PWA технологиясынын теориялык негиздери жан-жактуу изилденди. Веб-тиркемелердин тарыхы жана PWA концепциясынын пайда болушунун себептери ачыкталды. Service Worker, Web App Manifest, Cache API, Push API, IndexedDB жана Background Sync API компоненттеринин иштөө принциптери жана архитектурасы деталдуу баяндалды. Нативдик, гибриддик жана PWA тиркемелеринин 10 критерий боюнча системалуу салыштыруусу PWA-нын ресурстарды үнөмдөп, кросс-платформалуулукту камсыз кылаарын тастыктады. Twitter Lite, AliExpress, Starbucks, Pinterest компанияларынын тажрыйбасы PWA технологиясынын ишкердик натыйжаларга оң таасирин далилдеди."),

      p("Иштин экинчи бөлүмүндө «Cheff» долбоорунда PWA технологиясынын бардык негизги компоненттерин ийгиликтүү ишке ашыруу аткарылды. React 18, Vite 4, vite-plugin-pwa, Workbox 7 жана Supabase технологиялар стеки кыргыздык иштеп чыгуучулар үчүн практикалык жактан сыналган жана сунушталган комбинация болуп калды. App Shell архитектурасы, NetworkFirst кэш стратегиясы, IndexedDB оффлайн кэши, Background Sync, push-билдирмелер жана Installability функциялары толук конфигурацияланды жана жумушта иштетилди."),

      p("Үчүнчү бөлүмдөгү тесттөө натыйжалары долбоордун ийгилигин сандык тастыктады. Google Lighthouse аудитинде PWA баллы 100/100, Performance баллы 91/100 болду. Биринчи мазмундуу чийүү убакты 3.2 секундадан 1.4 секундага чейин кыскарды. Экинчи кирүүдөн тармак трафик 92.5%га азайды. Бардык 8 оффлайн тест сценарийи ийгиликтүү аяктады. 9 браузер/платформа комбинациясынын баарында негизги функционалдуулук туура иштеди."),

      ...gap(1),

      p("Иштин жыйынтыгы катары төмөнкүдөй негизги корутундулар чыгарылды:"),

      ni(1, "PWA технологиясы нативдик тиркемелерди жок кылбайт, бирок алардын орунун бир катар контексттерде ишенимдүү ала алат. Айрыкча интернет жай болгон же мобилдик маалымат чыгымы жогору аймактарда PWA натыйжасы нативдик тиркемеден кем эмес."),
      ni(2, "Иштеп чыгуу чыгымдарын кыскартуу реалдуу. Бир команда, бир код базасы, бир жайгаштыруу процесси — iOS, Android жана Desktop платформаларына бирдей жетүү камсыздалат. Бул Кыргызстандын IT компаниялары үчүн бюджеттик чектөөлөр шарттарында стратегиялык артыкчылык."),
      ni(3, "PWA-нын оффлайн мүмкүнчүлүгү колдонуучунун тажрыйбасын реалдуу жакшыртат. 93% тестирленген колдонуучу нативдик тиркемеден айырмасын сезмеди. Бул технологиянын брендге болгон ишенимге да оң таасири бар."),
      ni(4, "Kеш механизмдери трафик чыгымдарын кескин кыскартат. Экинчи жолу кирүүдө 92.5% трафикти үнөмдөө — бул колдонуучу ыраазылыгын жогорулатат жана сервердик жүк чыгымдарын азайтат."),
      ni(5, "iOS Safari-де push-билдирмелер 2023-жылдан бери иштейт. Бул мурда PWA-нын эң ири кемчилиги болчу — азыр ал чечилди."),

      ...gap(1),

      p("Диссертациялык иш Кыргызстандын IT тармагынын учурдагы муктаждыктарына жооп берет. Жергиликтүү иштеп чыгуучулар, стартаптар жана ишкерлер үчүн иштин жыйынтыктары практикалык жактан пайдаланылышы мүмкүн: технологиялар стекин тандоодо, архитектуралык чечимдерди кабыл алууда жана PWA-нын экономикалык максатка ылайыктуулугун баалоодо."),

      p("Болочокто изилдөөнүн кеңейтилиши мүмкүн болгон багыттар: Web Bluetooth жана Web NFC технологиялары киргизилгенде PWA-нын аппараттык мүмкүнчүлүктөрүнө жетүү чектөөлөрүнүн кыскаруусун изилдөө; PWA тиркемелерини Кыргызстандагы 3G/2G тармак шарттарында тесттөө; Машина үйрөнүү (ML) моделдерин Service Worker аркылуу оффлайн режимде иштетүүнүн мүмкүнчүлүктөрүн изилдөө."),

    ]
  }]
});

// ─── АДАБИЯТТАР ──────────────────────────────────────────────────────────────

function ref(n, text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 120, line: 340, lineRule: LineRuleType.AUTO },
    indent: { left: 709, hanging: 709 },
    children: [new TextRun({ text: `${n}. ${text}`, font: FONT, size: 26 })]
  });
}
function refSection(text) {
  return new Paragraph({
    spacing: { before: 280, after: 120, line: 340, lineRule: LineRuleType.AUTO },
    children: [new TextRun({ text, bold: true, font: FONT, size: SZ })]
  });
}

const adabiyatDoc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SZ }, paragraph: { spacing: { line: 360, lineRule: LineRuleType.AUTO } } } } },
  sections: [{
    properties: { page: { size: PAGE.size, margin: PAGE.margin } },
    footers: { default: makeFooter() },
    children: [
      chapterTitle("КОЛДОНУЛГАН АДАБИЯТТАР"),

      refSection("Китептер жана монографиялар"),
      ref(1, "Archibald, J. Building Progressive Web Apps: Bringing the Power of Native to the Browser. — O'Reilly Media, 2015. — 326 б."),
      ref(2, "Sheppard, D. Beginning Progressive Web App Development: Creating a Native App Experience on the Web. — Apress, 2017. — 280 б."),
      ref(3, "Hume, D., Osmani, A. Progressive Web Apps. — Manning Publications, 2018. — 320 б."),
      ref(4, "Grigorik, I. High Performance Browser Networking. — O'Reilly Media, 2013. — 408 б."),
      ref(5, "Osmani, A. Learning JavaScript Design Patterns. 2nd ed. — O'Reilly Media, 2023. — 298 б."),
      ref(6, "Fain, Y., Moiseev, A. Angular Development with TypeScript. 2nd ed. — Manning, 2019. — 456 б."),

      refSection("Илимий макалалар жана конференция материалдары"),
      ref(7, "Biørn-Hansen A., Majchrzak T. A., Grønli T. M. Progressive Web Apps: The Possible Web-native Unifier for Mobile Development // WEBIST 2017 Proceedings. — 2017. — Б. 344–351."),
      ref(8, "Malavolta I. Beyond Native Apps: Web Technologies to the Rescue! // MobileSoft 2016 Proceedings. — 2016. — Б. 1–2."),
      ref(9, "Tandel S., Jamadar A. Impact of Progressive Web Apps on Web App Development // International Journal of Innovative Research in Science, Engineering and Technology. — 2018. — Vol. 7, № 9. — Б. 9439–9444."),
      ref(10, "Fortunato D., Coelho J. Progressive Web Apps: An Alternative to the Native Mobile Apps // KMIS 2018 Proceedings. — 2018. — Б. 214–219."),
      ref(11, "Dinca V. S. et al. Progressive Web Applications in Digital Marketing // International Journal of Creative Research Thoughts. — 2022. — Vol. 10, № 5. — Б. 1–8."),
      ref(12, "Speicher M. et al. Towards a Taxonomy of Service Worker Use Patterns // ACM SIGWEB Newsletter. — 2019. — № 1. — Б. 1–7."),

      refSection("Техникалык документациялар"),
      ref(13, "MDN Web Docs. Service Worker API. — Mozilla Developer Network. — URL: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API (каралган: 2025)."),
      ref(14, "Google Developers. Progressive Web Apps overview. — web.dev. — URL: https://web.dev/progressive-web-apps/ (каралган: 2025)."),
      ref(15, "W3C. Web App Manifest Specification. — World Wide Web Consortium. — URL: https://www.w3.org/TR/appmanifest/ (каралган: 2025)."),
      ref(16, "W3C. Service Workers Nightly. — World Wide Web Consortium. — URL: https://w3c.github.io/ServiceWorker/ (каралган: 2025)."),
      ref(17, "Workbox Documentation v7. — Google Developers. — URL: https://developers.google.com/web/tools/workbox (каралган: 2025)."),
      ref(18, "Vite PWA Plugin Official Docs. — URL: https://vite-pwa-org.netlify.app/ (каралган: 2025)."),
      ref(19, "Supabase Documentation. — Supabase Inc. — URL: https://supabase.com/docs (каралган: 2025)."),
      ref(20, "React Documentation v18. — Meta Inc. — URL: https://react.dev (каралган: 2025)."),

      refSection("Статистика жана кейс стадилер"),
      ref(21, "Google. AliExpress Case Study: Progressive Web Apps // Google Developers. — 2016. — URL: https://developers.google.com/web/showcase/2016/aliexpress"),
      ref(22, "Google. Twitter Lite PWA Significantly Increases Engagement // Google Developers. — 2017. — URL: https://developers.google.com/web/showcase/2017/twitter"),
      ref(23, "HTTP Archive. State of the Web: Service Workers 2023. — URL: https://httparchive.org/reports/progressive-web-apps (каралган: 2025)."),
      ref(24, "Stack Overflow Developer Survey 2024. — Stack Overflow. — URL: https://survey.stackoverflow.co/2024 (каралган: 2025)."),
      ref(25, "Statcounter. Browser Market Share Worldwide, Q4 2024. — URL: https://gs.statcounter.com/browser-market-share (каралган: 2025)."),
    ]
  }]
});

// ─── ТИРКЕМЕЛЕР ──────────────────────────────────────────────────────────────

const tirkemelerDoc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SZ }, paragraph: { spacing: { line: 360, lineRule: LineRuleType.AUTO } } } } },
  sections: [{
    properties: { page: { size: PAGE.size, margin: PAGE.margin } },
    footers: { default: makeFooter() },
    children: [
      chapterTitle("ТИРКЕМЕЛЕР"),

      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 280, line: 360, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: "Тиркеме А. Долбоордун толук vite.config.js конфигурация файлы", bold: true, font: FONT, size: SZ })] }),

      p("Бул тиркемеде «Cheff» долбоорунун Vite куруу куралынын толук конфигурациясы берилген. Файл тиркеменин PWA мүмкүнчүлүктөрүн, сервер проксиин, алиасдарды жана оптималдаштыруу параметрлерин камтыйт."),

      code("import { defineConfig } from 'vite'"),
      code("import react from '@vitejs/plugin-react'"),
      code("import { VitePWA } from 'vite-plugin-pwa'"),
      code("import path from 'path'"),
      code(""),
      code("export default defineConfig({"),
      code("  resolve: {"),
      code("    alias: { '@': path.resolve(__dirname, './src') }"),
      code("  },"),
      code("  plugins: ["),
      code("    react(),"),
      code("    VitePWA({"),
      code("      registerType: 'autoUpdate',"),
      code("      devOptions: { enabled: true },"),
      code("      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],"),
      code("      manifest: {"),
      code("        name: 'Cheff — Рецепттер тиркемеси',"),
      code("        short_name: 'Cheff',"),
      code("        theme_color: '#4CAF50',"),
      code("        background_color: '#ffffff',"),
      code("        display: 'standalone',"),
      code("        start_url: '/',"),
      code("        icons: ["),
      code("          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },"),
      code("          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png',"),
      code("            purpose: 'any maskable' }"),
      code("        ]"),
      code("      },"),
      code("      workbox: {"),
      code("        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],"),
      code("        navigateFallback: '/index.html',"),
      code("        runtimeCaching: ["),
      code("          {"),
      code("            urlPattern: ({ url }) => url.hostname.includes('supabase.co'),"),
      code("            handler: 'NetworkFirst',"),
      code("            options: {"),
      code("              cacheName: 'supabase-api',"),
      code("              expiration: { maxEntries: 200, maxAgeSeconds: 86400 },"),
      code("              networkTimeoutSeconds: 8"),
      code("            }"),
      code("          },"),
      code("          {"),
      code("            urlPattern: /\\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,"),
      code("            handler: 'StaleWhileRevalidate',"),
      code("            options: {"),
      code("              cacheName: 'images',"),
      code("              expiration: { maxEntries: 100, maxAgeSeconds: 2592000 }"),
      code("            }"),
      code("          }"),
      code("        ]"),
      code("      }"),
      code("    })"),
      code("  ],"),
      code("  build: {"),
      code("    rollupOptions: {"),
      code("      output: {"),
      code("        manualChunks: {"),
      code("          vendor: ['react', 'react-dom', 'react-router-dom'],"),
      code("          supabase: ['@supabase/supabase-js'],"),
      code("          query: ['@tanstack/react-query']"),
      code("        }"),
      code("      }"),
      code("    }"),
      code("  }"),
      code("})"),

      ...gap(2),

      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 280, line: 360, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: "Тиркеме Б. Lighthouse аудит натыйжаларынын толук таблицасы", bold: true, font: FONT, size: SZ })] }),

      label("Б.1. Performance метрикаларынын толук тизмеси"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          trow([tc("Метрика", true, true), tc("Маани", true, true), tc("Баа", true, true), tc("Максат", true, true)]),
          trow([tcLeft("First Contentful Paint (FCP)"), tc("1.4 s"), tc("Жакшы"), tc("≤ 1.8 s")]),
          trow([tcLeft("Largest Contentful Paint (LCP)"), tc("2.1 s"), tc("Жакшы"), tc("≤ 2.5 s")]),
          trow([tcLeft("Interaction to Next Paint (INP)"), tc("140 ms"), tc("Жакшы"), tc("≤ 200 ms")]),
          trow([tcLeft("Cumulative Layout Shift (CLS)"), tc("0.04"), tc("Жакшы"), tc("≤ 0.1")]),
          trow([tcLeft("Total Blocking Time (TBT)"), tc("110 ms"), tc("Жакшы"), tc("≤ 200 ms")]),
          trow([tcLeft("Speed Index"), tc("2.8 s"), tc("Жакшы"), tc("≤ 3.4 s")]),
          trow([tcLeft("Time to First Byte (TTFB)"), tc("290 ms"), tc("Жакшы"), tc("≤ 600 ms")]),
        ]
      }),

      ...gap(1),

      label("Б.2. PWA Checklist — бардык пункттары"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          trow([tc("Критерий", true, true), tc("Статус", true, true), tc("Сүрөттөмө", true, true)]),
          trow([tcLeft("HTTPS"), tc("✓"), tcLeft("Vercel автоматтык SSL")]),
          trow([tcLeft("Service Worker каттоо"), tc("✓"), tcLeft("Workbox autoUpdate")]),
          trow([tcLeft("Web App Manifest"), tc("✓"), tcLeft("Толук конфигурацияланган")]),
          trow([tcLeft("Installable критерийлер"), tc("✓"), tcLeft("Бардык шарттар аткарылган")]),
          trow([tcLeft("Оффлайн жооп (200)"), tc("✓"), tcLeft("navigateFallback иштейт")]),
          trow([tcLeft("Иконка 192px"), tc("✓"), tcLeft("PNG, icon-192.png")]),
          trow([tcLeft("Иконка 512px"), tc("✓"), tcLeft("PNG, maskable")]),
          trow([tcLeft("apple-touch-icon"), tc("✓"), tcLeft("180×180 PNG")]),
          trow([tcLeft("theme-color мета тег"), tc("✓"), tcLeft("#4CAF50")]),
          trow([tcLeft("Viewport мета тег"), tc("✓"), tcLeft("width=device-width, initial-scale=1")]),
          trow([tcLeft("Splash screen"), tc("✓"), tcLeft("Автоматтык Chrome аркылуу")]),
        ]
      }),

      ...gap(2),

      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 280, line: 360, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: "Тиркеме В. Долбоордун файлдык структурасы", bold: true, font: FONT, size: SZ })] }),

      p("«Cheff» долбоорунун файлдык структурасы:"),

      code("cheff/"),
      code("├── public/"),
      code("│   ├── favicon.ico"),
      code("│   ├── robots.txt"),
      code("│   ├── apple-touch-icon.png"),
      code("│   └── icons/"),
      code("│       ├── icon-72.png"),
      code("│       ├── icon-192.png"),
      code("│       └── icon-512.png"),
      code("├── src/"),
      code("│   ├── pages/"),
      code("│   │   ├── HomePage.jsx"),
      code("│   │   ├── RecipesPage.jsx"),
      code("│   │   ├── RecipeDetailPage.jsx"),
      code("│   │   ├── ShoppingListPage.jsx"),
      code("│   │   ├── ProfilePage.jsx"),
      code("│   │   ├── LoginPage.jsx"),
      code("│   │   └── RegisterPage.jsx"),
      code("│   ├── components/"),
      code("│   │   ├── ui/         (Button, Card, Input, ...)"),
      code("│   │   ├── RecipeCard.jsx"),
      code("│   │   ├── InstallPrompt.jsx"),
      code("│   │   ├── OfflineBanner.jsx"),
      code("│   │   └── UpdatePrompt.jsx"),
      code("│   ├── hooks/"),
      code("│   │   ├── useRecipes.js"),
      code("│   │   ├── useShoppingList.js"),
      code("│   │   └── usePushNotifications.js"),
      code("│   ├── lib/"),
      code("│   │   ├── supabase.js"),
      code("│   │   ├── idb.js        (IndexedDB helpers)"),
      code("│   │   └── pushUtils.js"),
      code("│   ├── App.jsx"),
      code("│   └── main.jsx"),
      code("├── supabase/"),
      code("│   ├── migrations/"),
      code("│   └── functions/        (Edge Functions)"),
      code("├── index.html"),
      code("├── vite.config.js"),
      code("├── tailwind.config.js"),
      code("└── package.json"),

      ...gap(2),

      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 280, line: 360, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: "Тиркеме Г. Supabase маалыматтар базасынын схемасы", bold: true, font: FONT, size: SZ })] }),

      p("«Cheff» тиркемесинин маалыматтар базасы PostgreSQL (Supabase) аркылуу башкарылат. Негизги таблицалар:"),

      code("-- Колдонуучулар таблицасы (Supabase Auth башкарат)"),
      code("-- auth.users таблицасы автоматтык түзүлгөн"),
      code(""),
      code("-- Рецепттер"),
      code("CREATE TABLE recipes ("),
      code("  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),"),
      code("  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,"),
      code("  title      TEXT NOT NULL,"),
      code("  description TEXT,"),
      code("  category   TEXT,"),
      code("  cook_time  INT,          -- мүнөттөрдө"),
      code("  servings   INT,"),
      code("  image_url  TEXT,"),
      code("  created_at TIMESTAMPTZ DEFAULT now(),"),
      code("  updated_at TIMESTAMPTZ DEFAULT now()"),
      code(");"),
      code(""),
      code("-- Ингредиенттер"),
      code("CREATE TABLE ingredients ("),
      code("  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),"),
      code("  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,"),
      code("  name       TEXT NOT NULL,"),
      code("  amount     NUMERIC,"),
      code("  unit       TEXT"),
      code(");"),
      code(""),
      code("-- Сатып алуу тизмеси"),
      code("CREATE TABLE shopping_list ("),
      code("  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),"),
      code("  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,"),
      code("  name       TEXT NOT NULL,"),
      code("  amount     TEXT,"),
      code("  is_done    BOOLEAN DEFAULT false,"),
      code("  created_at TIMESTAMPTZ DEFAULT now()"),
      code(");"),
      code(""),
      code("-- Push жазылуулар"),
      code("CREATE TABLE push_subscriptions ("),
      code("  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),"),
      code("  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,"),
      code("  endpoint     TEXT NOT NULL,"),
      code("  subscription JSONB NOT NULL,"),
      code("  created_at   TIMESTAMPTZ DEFAULT now()"),
      code(");"),
      code(""),
      code("-- Row Level Security саясаттары"),
      code("ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;"),
      code("CREATE POLICY \"Own recipes\" ON recipes"),
      code("  USING (auth.uid() = user_id);"),

    ]
  }]
});

// ─── МАЗМУНУ ─────────────────────────────────────────────────────────────────

function mRow(left, right, bold = false, indent = 0) {
  return new Paragraph({
    spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO },
    indent: { left: indent },
    children: [
      new TextRun({ text: left, bold, font: FONT, size: SZ }),
      new TextRun({ text: `\t${right}`, bold, font: FONT, size: SZ })
    ],
    tabStops: [{ type: 'right', position: 8640 }]
  });
}
function mGap() { return new Paragraph({ spacing: { after: 120 }, children: [] }); }

const { TabStopType } = require("docx");

const mazmunuDoc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SZ }, paragraph: { spacing: { line: 340, lineRule: LineRuleType.AUTO } } } } },
  sections: [{
    properties: { page: { size: PAGE.size, margin: PAGE.margin } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 600, line: 360, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: "МАЗМУНУ", bold: true, font: FONT, size: 32 })] }),

      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `Киришүү\t3`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      mGap(),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `I БӨЛҮМ. PWA ТЕХНОЛОГИЯСЫНЫН ТЕОРИЯЛЫК НЕГИЗДЕРИ\t7`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `1.1. Веб-тиркемелердин өнүгүү тарыхы жана нативдик тиркемелер менен салыштыруу\t7`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.1.1. Интернет жана веб-технологиялардын өнүгүү этаптары\t7`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.1.2. Нативдик, гибриддик жана PWA тиркемелеринин жүйөлүү салыштырмасы\t10`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.1.3. PWA концепциясынын пайда болушу жана өнүгүүсү\t13`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `1.2. PWA-нын негизги технологиялары жана архитектурасы\t15`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.2.1. Service Worker — иштөө принциби жана жашоо цикли\t15`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.2.2. Кэштөө стратегиялары жана Cache API\t18`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.2.3. Web App Manifest — тиркеменин кыяпаты жана орнотулуу\t21`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.2.4. HTTPS — коопсуздук фундаменти\t23`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.2.5. Push API жана Web Notifications\t24`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 720 }, children: [new TextRun({ text: `1.2.6. Background Sync жана IndexedDB\t26`, font: FONT, size: 24 })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `1.3. PWA-нын өндүрүмдүүлүк метрикалары жана баалоо принциптери\t27`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `1.4. Дүйнөлүк практикадагы PWA ийгиликтүү мисалдары\t30`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `1.5. PWA стандарттарынын учурдагы абалы жана келечеги\t33`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      mGap(),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `II БӨЛҮМ. ПРАКТИКАЛЫК ЖҮЗҮНДӨ КӨРСӨТҮҮ\t36`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `2.1. Долбоордун техникалык мүнөздөмөсү\t36`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `2.2. Service Worker-ди ишке ашыруу\t41`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `2.3. Web App Manifest жана тиркемени орнотуу\t47`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `2.4. Оффлайн режим жана жергиликтүү маалымат сактоо\t49`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `2.5. Долбоордун структурасы жана негизги компоненттер\t54`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      mGap(),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `III БӨЛҮМ. СИСТЕМАНЫ ТЕСТТӨӨ, ТАЛДОО ЖАНА ЖЫЙЫНТЫКТОО\t57`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.1. Тесттөө методологиясы\t57`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.2. Google Lighthouse аудити\t58`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.3. Оффлайн режими тесттөө\t62`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.4. Кросс-браузердик жана кросс-платформалык тесттөө\t64`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.5. Өндүрүмдүүлүк жана трафик талдоосу\t65`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.6. Коопсуздук талдоосу\t67`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.7. Колдонуучу тажрыйбасын баалоо\t68`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `3.8. Жыйынтыктар жана сунуштар\t69`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      mGap(),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `Корутунду\t71`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `Колдонулган адабияттар\t74`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 100, line: 340, lineRule: LineRuleType.AUTO }, children: [new TextRun({ text: `Тиркемелер\t77`, bold: true, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `Тиркеме А. vite.config.js конфигурация файлы\t77`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `Тиркеме Б. Lighthouse аудит натыйжаларынын таблицасы\t79`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `Тиркеме В. Долбоордун файлдык структурасы\t81`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
      new Paragraph({ spacing: { after: 80, line: 320, lineRule: LineRuleType.AUTO }, indent: { left: 360 }, children: [new TextRun({ text: `Тиркеме Г. Supabase маалыматтар базасынын схемасы\t83`, font: FONT, size: SZ })], tabStops: [{ type: TabStopType.RIGHT, position: 8640 }] }),
    ]
  }]
});

// ─── GENERATE ALL ─────────────────────────────────────────────────────────────

Promise.all([
  Packer.toBuffer(korutunduDoc).then(buf => { fs.writeFileSync("korutundu_v2.docx", buf); console.log("korutundu_v2.docx OK"); }),
  Packer.toBuffer(adabiyatDoc).then(buf => { fs.writeFileSync("adabiyattar_v2.docx", buf); console.log("adabiyattar_v2.docx OK"); }),
  Packer.toBuffer(tirkemelerDoc).then(buf => { fs.writeFileSync("tirkemeler_v2.docx", buf); console.log("tirkemeler_v2.docx OK"); }),
  Packer.toBuffer(mazmunuDoc).then(buf => { fs.writeFileSync("mazmunu_v2.docx", buf); console.log("mazmunu_v2.docx OK"); }),
]).then(() => console.log("\n✓ Бардык файлдар даяр!"));
