const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } = require("docx");
const fs = require("fs");

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 400 },
    children: [new TextRun({ text, bold: true, size: 30, font: "Times New Roman" })]
  });
}
function heading2(text) {
  return new Paragraph({
    spacing: { before: 300, after: 200 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Times New Roman" })]
  });
}
function heading3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 150 },
    children: [new TextRun({ text, bold: true, underline: { type: UnderlineType.SINGLE }, size: 28, font: "Times New Roman" })]
  });
}
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 180, line: 360 },
    indent: { firstLine: 720 },
    children: [new TextRun({ text, size: 28, font: "Times New Roman" })]
  });
}
function bullet(text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 100, line: 340 },
    indent: { left: 720 },
    children: [new TextRun({ text: `— ${text}`, size: 28, font: "Times New Roman" })]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { after: 100, line: 280 },
    indent: { left: 720 },
    children: [new TextRun({ text, font: "Courier New", size: 22 })]
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

      title("II БӨЛҮМ. ПРАКТИКАЛЫК ЖҮЗҮНДӨ КӨРСӨТҮҮ"),

      // 2.1
      heading2("2.1. Долбоордун техникалык мүнөздөмөсү"),

      heading3("2.1.1. Долбоордун максаты жана колдонуучулар аудиториясы"),

      body("Бул диссертациялык иштин практикалык бөлүгүндө каралган долбоор — азык-түлүк тапшырыштарын башкарууга арналган веб-тиркеме (Cheff). Тиркеменин негизги максаты — колдонуучуларга рецепттерди сактоо, тамак пиширүүгө керектүү ингредиенттерди пландоо жана дүкөнгө тизме түзүү мүмкүнчүлүгүн берүү."),

      body("Колдонуучулар аудиториясы — смартфон жана ноутбук колдонгон жаш адамдар жана үй-бүлөлөр. Алардын бир бөлүгү интернет байланышы туруксуз шарттарда (уй жактары, жол, маршрутка) тиркемени колдонушу мүмкүн. Бул жагдай оффлайн иштөөнүн маанисин өзгөчө жогору кылат жана PWA технологиясын колдонуунун максаттуулугун тастыктайт."),

      body("Тиркеме колдонуучудан App Store же Play Store аркылуу орнотуу талап кылбайт — браузер аркылуу оңой кире алышат, ал эми каалагандар аны үй экранына орнотушу мүмкүн."),

      heading3("2.1.2. Колдонулган технологиялар стеки"),

      body("Долбоордун фронтенд бөлүгү заманбап JavaScript технологиялары негизинде курулган. Технологиялар стеки:"),

      bullet("React — колдонуучу интерфейсин курууга арналган JavaScript китепканасы;"),
      bullet("Vite — тез жана жеңил фронтенд куруу куралы (build tool);"),
      bullet("Supabase — бэкенд катары колдонулган açık kaynak Firebase альтернативасы (PostgreSQL, Auth, Storage);"),
      bullet("Tailwind CSS — утилита-биринчи CSS фреймворк;"),
      bullet("Vite PWA Plugin (vite-plugin-pwa) — Vite долбооруна Service Worker жана Manifest автоматтык кошуу плагини;"),
      bullet("Workbox — Google тарабынан иштелип чыккан Service Worker стратегияларын башкаруу китепканасы."),

      heading3("2.1.3. Архитектуранын сүрөттөлүшү"),

      body("Долбоордун архитектурасы клиент-сервер моделине негизделген. Фронтенд (React) колдонуучунун браузеринде иштейт жана Supabase API аркылуу маалыматтар базасы менен байланышат. Service Worker ортодо орун алып, тармак суроо-талаптарын тосот жана кэш стратегиясын башкарат."),

      body("Тиркеменин компоненттери: авторизация модулу, рецепттер каталогу, ингредиенттер тизмеси, сатып алуу тизмеси жана профиль баракчасы. Ар бир компонент React хуктарын колдонуп, маалыматтарды Supabase-тан алат."),

      gap(),

      // 2.2
      heading2("2.2. Service Worker-ди ишке ашыруу"),

      heading3("2.2.1. Каттоо (Registration)"),

      body("Долбоордо Service Worker-ди кол менен жазуунун ордуна, vite-plugin-pwa плагини колдонулган. Бул плагин Workbox китепканасын интеграциялап, Service Worker кодун автоматтык генерациялайт. Vite конфигурация файлында PWA параметрлери төмөнкүчө орнотулат:"),

      code("// vite.config.js"),
      code("import { VitePWA } from 'vite-plugin-pwa'"),
      code(""),
      code("export default defineConfig({"),
      code("  plugins: ["),
      code("    VitePWA({"),
      code("      registerType: 'autoUpdate',"),
      code("      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],"),
      code("      manifest: { ... },"),
      code("      workbox: { ... }"),
      code("    })"),
      code("  ]"),
      code("})"),

      body("registerType: 'autoUpdate' параметри тиркеменин жаңы нускасы пайда болгондо Service Worker-дин автоматтык жаңырышын камсыз кылат. Колдонуучу барактарды кол менен жаңыртуунун кажети жок."),

      heading3("2.2.2. Кэштөө стратегиялары"),

      body("Долбоордо ар кандай ресурстар үчүн ар кандай кэштөө стратегиялары колдонулган. Бул чечим ресурстун мүнөзүнө жараша оптималдуу кэш жүрүм-турумун камсыз кылуу максатынан улам кабыл алынган:"),

      bullet("Статикалык ресурстар (JS, CSS, шрифтер, сүрөтчөлөр) — CacheFirst стратегиясы. Бул ресурстар сейрек өзгөрөт, ошондуктан кэштен бирден берилип, тиркеменин жүктөлүү ылдамдыгы жогорулайт."),
      bullet("API суроо-талаптары (Supabase) — NetworkFirst стратегиясы. Маалыматтар дайыма жаңыртылып турат, ошондуктан биринчи тармактан алынат; тармак жок болсо кэштен берилет."),
      bullet("Сүрөттөр — StaleWhileRevalidate стратегиясы. Кэштеги сүрөт дароо берилет, фондо жаңысы жүктөлөт."),

      body("Workbox конфигурациясы vite.config.js файлынын workbox бөлүмүндө орнотулат:"),

      code("workbox: {"),
      code("  runtimeCaching: ["),
      code("    {"),
      code("      urlPattern: /^https:\\/\\/.*\\.supabase\\.co\\/.*$/,"),
      code("      handler: 'NetworkFirst',"),
      code("      options: {"),
      code("        cacheName: 'supabase-cache',"),
      code("        expiration: { maxAgeSeconds: 86400 }"),
      code("      }"),
      code("    }"),
      code("  ]"),
      code("}"),

      heading3("2.2.3. Push-билдирмелерди ишке ашыруу"),

      body("Push-билдирмелер колдонуучунун тиркемени ачпай туруп маалымат алышына мүмкүндүк берет. Долбоордо push-билдирмелерди ишке ашыруу үчүн Web Push Protocol жана VAPID ачкычтары колдонулган."),

      body("Биринчи кадамда браузерден push-жазылуу уруксаты суралат:"),

      code("const registration = await navigator.serviceWorker.ready;"),
      code("const subscription = await registration.pushManager.subscribe({"),
      code("  userVisibleOnly: true,"),
      code("  applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)"),
      code("});"),

      body("Жазылуу маалыматы серверге жөнөтүлүп, Supabase маалыматтар базасында сакталат. Сервер тарабынан web-push китепканасы аркылуу колдонуучуга билдирме жиберилет."),

      gap(),

      // 2.3
      heading2("2.3. Web App Manifest конфигурациясы"),

      body("Web App Manifest долбоордо vite-plugin-pwa плагини аркылуу генерацияланат. manifest объектинин негизги параметрлери:"),

      code("manifest: {"),
      code("  name: 'Cheff — Рецепттер тиркемеси',"),
      code("  short_name: 'Cheff',"),
      code("  description: 'Рецепттерди башкаруу жана азык-түлүк тизмеси',"),
      code("  theme_color: '#4CAF50',"),
      code("  background_color: '#ffffff',"),
      code("  display: 'standalone',"),
      code("  start_url: '/',"),
      code("  icons: ["),
      code("    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },"),
      code("    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }"),
      code("  ]"),
      code("}"),

      body("display: 'standalone' режими тиркемени браузердин дарек тилкесисиз, нативдик тиркемеге окшош толук экранда ачышын камсыз кылат. Бул колдонуучуга нативдик тиркеме менен иштеп жаткандай таасир берет."),

      body("Иконкалар эки стандарттуу өлчөмдө даярдалды: 192×192 пиксел (Android үй экраны) жана 512×512 пиксел (Splash screen жана жогорку сапаттуу дисплейлер). Иконкалар PNG форматында сакталып, public/ папкасына жайгаштырылды."),

      gap(),

      // 2.4
      heading2("2.4. Тиркемени орнотуу мүмкүнчүлүгү (Installability)"),

      body("PWA-ны орнотуу процесси браузер тарабынан автоматтык башкарылат. Тиркемени орнотуу мүмкүнчүлүгүнүн шарттары:"),

      bullet("Тиркеме HTTPS аркылуу жайылтылган;"),
      bullet("Туура толтурулган Web App Manifest бар;"),
      bullet("Service Worker каттоодон өткөн жана активдүү;"),
      bullet("Тиркеме мурда орнотулган эмес."),

      body("Бул шарттар аткарылганда Chrome, Edge, Samsung Internet браузерлери beforeinstallprompt окуясын атат. Долбоордо бул окуя карманылып, колдонуучуга ыңгайлуу убакта орнотуу сунушу көрсөтүлгөн:"),

      code("let deferredPrompt;"),
      code("window.addEventListener('beforeinstallprompt', (e) => {"),
      code("  e.preventDefault();"),
      code("  deferredPrompt = e;"),
      code("  showInstallButton(); // Орнотуу баскычын көрсөтүү"),
      code("});"),

      body("Колдонуучу баскычты баскандан кийин орнотуу диалогу пайда болот жана ал тиркемени үй экранына орнотуп алат. Орнотулган тиркеме браузердин урук экранынан эмес, операциялык тутумдун жумуш тилкесинен же үй экранынан ачылат."),

      gap(),

      // 2.5
      heading2("2.5. Оффлайн режиминин иштешин көрсөтүү"),

      heading3("2.5.1. Маалыматтарды кэштөө"),

      body("Тиркеменин оффлайн иштөөсүн камсыз кылуу үчүн эки деңгээлдүү стратегия колдонулган. Биринчи деңгээл — Workbox аркылуу статикалык файлдарды (HTML барактары, CSS, JS бандлдары) алдын ала кэштөө (precaching). Бул файлдар тиркеме биринчи жолу ачылганда кэшке жазылат."),

      body("Экинчи деңгээл — Supabase API маалыматтарын NetworkFirst стратегиясы аркылуу динамикалык кэштөө. Колдонуучу рецепттерди же ингредиенттерди карагандан кийин, бул маалыматтар кэшке сакталат. Кийинки жолу тармак жок болсо да, колдонуучу мурда карап чыккан рецепттерге кире алат."),

      heading3("2.5.2. IndexedDB аркылуу жергиликтүү сактоо"),

      body("Оффлайн режимде жаңы рецепт кошуу же тизмени өзгөртүү сыяктуу маалыматтарды жаратуу/жаңыртуу операциялары үчүн IndexedDB колдонулган. Колдонуучу оффлайн режимде иш аткарганда, өзгөртүүлөр IndexedDB-де сакталат."),

      body("Тиркеме тармакка кайта туташканда, IndexedDB-дагы синхрондолбогон өзгөртүүлөр автоматтык Supabase серверине жөнөтүлөт. Бул Background Sync API аркылуу ишке ашырылат:"),

      code("self.addEventListener('sync', (event) => {"),
      code("  if (event.tag === 'sync-recipes') {"),
      code("    event.waitUntil(syncPendingChanges());"),
      code("  }"),
      code("});"),

      body("Бул ыкма колдонуучуга тармак байланышынан көз карандысыз тиркемени ырааттуу колдонуу мүмкүнчүлүгүн берет жана маалыматтардын жоголбосун камсыз кылат."),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("bolum_2_praktika.docx", buf);
  console.log("bolum_2_praktika.docx ийгиликтүү түзүлдү!");
});
