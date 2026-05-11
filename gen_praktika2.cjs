const { Document, Packer } = require("docx");
const fs = require("fs");
const {
  PAGE, makeFooter, chapterTitle, h2, h3, p, li, ni, gap, label, code,
  tc, tcLeft, trow, tableNote, Table, WidthType,
  AlignmentType, Paragraph, TextRun, FONT, SZ, LineRuleType
} = require("./fmt.cjs");

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SZ }, paragraph: { spacing: { line: 360, lineRule: LineRuleType.AUTO } } } } },
  sections: [{
    properties: { page: { size: PAGE.size, margin: PAGE.margin } },
    footers: { default: makeFooter() },
    children: [

      chapterTitle("II БӨЛҮМ. ПРАКТИКАЛЫК ЖҮЗҮНДӨ КӨРСӨТҮҮ"),

      h2("2.1. Долбоордун техникалык мүнөздөмөсү"),

      h3("2.1.1. Долбоордун максаты жана колдонуучулар аудиториясы"),

      p("Бул диссертациялык иштин практикалык бөлүгүндө каралган «Cheff» долбоору — рецепттерди башкаруу жана тамак пиширүүгө даярдоого жардам берүүчү заманбап веб-тиркеме. Тиркеменин концепциясы жөнөкөй, бирок маанилүү муктаждыктан туулган: адамдар тамак пиширерде убакыт жоготот — пиширүүчү нерсени ойлонуп, ингредиенттерди эсептеп жана дүкөнгө эмне алышты унутуп."),

      p("«Cheff» тиркемесинин негизги функциялары: рецепттерди түзүү жана категориялоо, ингредиенттер тизмесин автоматтык генерациялоо, сатып алуу тизмесин (shopping list) башкаруу, тамак пиширүүнүн кадам-кадам нускамасы жана калория эсептегич. Тиркеме оффлайн режимде толук иштей алат — бул жагдай PWA технологиясын колдонуунун биринчи кезектеги себеби болуп саналат."),

      p("Колдонуучулар аудиториясы — үй хозяйкалары, студенттер, жаш адамдар жана тамак пиширүүгө кызыккан ар кандай адамдар. Алардын олуттуу бөлүгү тиркемени дүкөндө же ашканада — тармак байланышы туруксуз жерлерде — колдонот. App Store орнотуу барьерин жок кылуу конверсияны жогорулатат, анткени колдонуучулар сайтты карап көрүп, дароо тиркемедей тажрыйбаны ала алат."),

      p("Долбоордун техникалык максаттары: Birinchiden, PWA стандарттарынын бардык негизги талаптарын аткаруу — Lighthouse PWA баллы 100 болушу. Экинчиден, Performance баллы 85-тен жогору болуу — тиркеме тез жүктөлүшү зарыл. Үчүнчүдөн, оффлайн режимде негизги функциялардын жеткиликтүүлүгүн камсыз кылуу. Төртүнчүдөн, iOS, Android жана Desktop платформаларында туура иштешин тестирлөө жана тастыктоо."),

      h3("2.1.2. Технологиялар стеки жана тандоо негиздемеси"),

      p("Долбоордун технологиялар стеки иштеп чыгуунун жылдамдыгы, коомчулук колдоосу, PWA интеграциясынын жеңилдиги жана өндүрүмдүүлүк критерийлери боюнча тандалган. Ар бир технологиянын тандалышынын конкреттүү негиздемеси бар."),

      p("React 18 — Facebook тарабынан иштелип чыккан, компонент негизиндеги JavaScript UI китепканасы. React тандалышынын себептери: Virtual DOM аркылуу UI жаңыртууларды оптималдаштыруу, бай экосистема (React Router, React Query ж.б.), Concurrent Mode менен React 18 асинхрондуу рендерлөөнү жакшырткан. Дүйнөдөгү эң популярдуу фронтенд инструменттеринин бири болуп, Stack Overflow Developer Survey 2023 боюнча фронтенд фреймворктар арасынан эң жогорку колдонуу рейтингине ээ."),

      p("Vite 4 — Vue.js-тин авторлору тарабынан жаратылган жаңы муундагы фронтенд куруу куралы. Webpack-ка салыштырганда Vite ES модулдарды нативдик түрдө колдонот, бул иштеп чыгуу сервери баштоосун 10–100 эсеге тездетет. Чоң долбоорлордо «чык туруп кут» мезгили жоголот. vite-plugin-pwa плагини Service Worker жана Manifest автоматтык генерациялоо, Workbox интеграциясы жана иштеп чыгуу режиминде PWA тесттөө мүмкүнчүлүктөрүн сунуштайт."),

      p("Supabase — PostgreSQL маалыматтар базасына негизделген ачык булактуу «Backend as a Service» платформасы. Firebase-га альтернатива катары Supabase тандалышынын себептери: ачык булактуу (open source), SQL негизделген маалыматтар базасы (NoSQL-га салыштырганда татаал суроо-талаптар), Row Level Security (RLS) аркылуу маалымат коопсуздугу, реалдуу убакыт жазылуулары (realtime subscriptions), колдонууга оңой JavaScript SDK жана REST API."),

      p("Tailwind CSS — утилита-биринчи CSS фреймворки. Стиль файлдарын өзүнчө жазуунун ордуна, HTML элементтерине утилита класстарын (flex, py-2, text-center ж.б.) колдонулат. Бул ыкма CSS файлынын өлчөмүн кескин кыскартат жана макет тутумдашуусун камсыз кылат."),

      p("Workbox 7 — Google тарабынан иштелип чыккан, Service Worker стратегияларын конфигурациялоону жеңилдетүүчү JavaScript китепкана. Workbox прекэшинг (precaching), рантайм кэштөө стратегиялары жана маршрут конфигурациясы сыяктуу функцияларды жогорку деңгээлдеги API аркылуу сунуштайт, бул Service Worker-ди кол менен жазуудан алда канча оңой жана коопсуз."),

      label("Таблица 2.1 — Долбоордун технологиялар стеки"),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          trow([tc("Технология", true, true), tc("Версия", true, true), tc("Роль", true, true), tc("Тандоо себеби", true, true)]),
          trow([tcLeft("React"), tc("18.2"), tcLeft("UI китепкана"), tcLeft("Компонент архитектурасы, Virtual DOM")]),
          trow([tcLeft("Vite"), tc("4.5"), tcLeft("Build tool"), tcLeft("Тез өнүктүрүү, PWA плагини")]),
          trow([tcLeft("vite-plugin-pwa"), tc("0.17"), tcLeft("PWA кош кыр"), tcLeft("Workbox интеграциясы, авто SW")]),
          trow([tcLeft("Workbox"), tc("7.0"), tcLeft("SW стратегиялар"), tcLeft("Google колдоосу, мыкты документация")]),
          trow([tcLeft("Supabase"), tc("2.x"), tcLeft("Backend / DB"), tcLeft("Ачык булак, PostgreSQL, RLS")]),
          trow([tcLeft("Tailwind CSS"), tc("3.4"), tcLeft("CSS фреймворк"), tcLeft("Утилиталар, кичине CSS чыгышы")]),
          trow([tcLeft("React Query"), tc("5.x"), tcLeft("Серверлик абал"), tcLeft("Кэштөө, фоно жаңыртуу, оффлайн")]),
        ]
      }),

      ...gap(1),

      h3("2.1.3. Архитектуранын сүрөттөлүшү"),

      p("«Cheff» долбоорунун архитектурасы үч катмарлуу (three-tier): презентация катмары (React компоненттер), бизнес-логика катмары (React Query хуктар жана утилита функциялары) жана маалымат катмары (Supabase SDK + IndexedDB). Бул бөлүнүш кодду тестирлөөнү, кайра колдонулушун жана кармоо мүмкүнчүлүгүн жогорулатат."),

      p("Тиркеменин файлдык структурасы Feature-Sliced Design (FSD) принцибине кыйла жакын. Негизги папкалар: src/pages (маршруттарга дал келген барак компоненттери), src/components (кайра колдонулуучу UI компоненттер), src/hooks (бизнес-логика хуктар), src/lib (Supabase клиент, утилиталар), src/store (глобалдуу абал), public/icons (PWA иконкалары)."),

      p("Тиркеменин маршрутизациясы React Router v6 менен ишке ашырылган. Lazy loading (жалкоо жүктөө) ар бир маршрут үчүн өзүнчө чанк (chunk) түзүлүшүн камсыз кылат — баракты биринчи жолу ачканда бардык код жүктөлбөйт, жалаң гана керектүүсү гана жүктөлөт. Бул First Contentful Paint убактысын кыскартат."),

      ...gap(1),
      h2("2.2. Service Worker-ди ишке ашыруу"),

      h3("2.2.1. vite-plugin-pwa менен Workbox конфигурациясы"),

      p("Долбоордо Service Worker-ди кол менен жазуунун ордуна, vite-plugin-pwa плагини жана Workbox китепканасы колдонулду. Бул чечим иштеп чыгуу убактысын кыскартат жана кош катааларды азайтат. Плагин vite.config.js файлына кошулат жана куруу (build) убагында автоматтык Service Worker кодун генерациялайт."),

      p("vite.config.js файлынын толук конфигурациясы:"),

      code("import { defineConfig } from 'vite'"),
      code("import react from '@vitejs/plugin-react'"),
      code("import { VitePWA } from 'vite-plugin-pwa'"),
      code(""),
      code("export default defineConfig({"),
      code("  plugins: ["),
      code("    react(),"),
      code("    VitePWA({"),
      code("      registerType: 'autoUpdate',"),
      code("      devOptions: {"),
      code("        enabled: true,"),
      code("        type: 'module'"),
      code("      },"),
      code("      includeAssets: ["),
      code("        'favicon.ico',"),
      code("        'apple-touch-icon.png',"),
      code("        'robots.txt'"),
      code("      ],"),
      code("      manifest: {"),
      code("        name: 'Cheff — Рецепттер тиркемеси',"),
      code("        short_name: 'Cheff',"),
      code("        description: 'Рецепттерди башкаруу жана тамак пиширүүгө даярдоо',"),
      code("        theme_color: '#4CAF50',"),
      code("        background_color: '#ffffff',"),
      code("        display: 'standalone',"),
      code("        start_url: '/',"),
      code("        scope: '/',"),
      code("        lang: 'ky',"),
      code("        icons: ["),
      code("          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },"),
      code("          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png',"),
      code("            purpose: 'any maskable' }"),
      code("        ]"),
      code("      },"),
      code("      workbox: {"),
      code("        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],"),
      code("        navigateFallback: '/index.html',"),
      code("        navigateFallbackDenylist: [/^\\/api\\//],"),
      code("        runtimeCaching: ["),
      code("          {"),
      code("            urlPattern: ({ url }) => url.hostname.includes('supabase.co'),"),
      code("            handler: 'NetworkFirst',"),
      code("            options: {"),
      code("              cacheName: 'supabase-api',"),
      code("              expiration: {"),
      code("                maxEntries: 200,"),
      code("                maxAgeSeconds: 60 * 60 * 24  // 24 саат"),
      code("              },"),
      code("              networkTimeoutSeconds: 8"),
      code("            }"),
      code("          },"),
      code("          {"),
      code("            urlPattern: /\\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,"),
      code("            handler: 'StaleWhileRevalidate',"),
      code("            options: {"),
      code("              cacheName: 'images',"),
      code("              expiration: {"),
      code("                maxEntries: 100,"),
      code("                maxAgeSeconds: 60 * 60 * 24 * 30  // 30 күн"),
      code("              }"),
      code("            }"),
      code("          },"),
      code("          {"),
      code("            urlPattern: /\\.(?:woff|woff2|ttf|otf)$/i,"),
      code("            handler: 'CacheFirst',"),
      code("            options: {"),
      code("              cacheName: 'fonts',"),
      code("              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }"),
      code("            }"),
      code("          }"),
      code("        ]"),
      code("      }"),
      code("    })"),
      code("  ]"),
      code("})"),

      p("registerType: 'autoUpdate' параметри тиркеменин жаңы нускасы орнотулганда Service Worker-дин автоматтык жаңырышын камсыз кылат. Бул иштеп чыгуу убагында жана өндүрүш чөйрөсүндө жаңыртуу процессин жеңилдетет."),

      p("navigateFallback: '/index.html' параметри бардык бет суроо-талаптарын (HTML navigation) кэштеги index.html-ге багыттайт. Бул Single Page Application (SPA) архитектурасында оффлайн маршрутизацияны камсыз кылат — колдонуучу кайсы URLга өтсө да, кэштеги тиркеме ачылат."),

      h3("2.2.2. Кэш версиялоо жана жаңыртуу стратегиясы"),

      p("Кэш версиялоо — долбоордо чечилиши керек болгон маанилүү маселе. Эски кэштеги файлдар жаңы нусканы жаап калса, колдонуучу чычканга тийишкен учурда таң калышы мүмкүн. vite-plugin-pwa бул маселени автоматтык чечет: kuruу убагында ар бир файлга уникалдуу хэш (мисалы, main.3f7a2c1.js) кошулат. Файл өзгөргөндө анын хэши өзгөрөт, Service Worker жаңы нускасын жүктеп алат."),

      p("Колдонуучуга жаңы нусканы жарыялоо: жаңы Service Worker активдешкенде, useRegisterSW хуку аркылуу UI-да «Жаңыртуу бар» баннери көрсөтүлөт. Колдонуучу «Жаңыртуу» баскычын баскандан кийин баракча жаңыртылып, жаңы нуска жүктөлөт."),

      code("import { useRegisterSW } from 'virtual:pwa-register/react'"),
      code(""),
      code("function UpdatePrompt() {"),
      code("  const { needRefresh, updateServiceWorker } = useRegisterSW()"),
      code("  const [show] = needRefresh"),
      code("  if (!show) return null"),
      code("  return ("),
      code("    <div className=\"update-banner\">"),
      code("      <span>Жаңы нуска жеткиликтүү!</span>"),
      code("      <button onClick={() => updateServiceWorker(true)}>"),
      code("        Жаңыртуу"),
      code("      </button>"),
      code("    </div>"),
      code("  )"),
      code("}"),

      h3("2.2.3. Push-билдирмелерди ишке ашыруу"),

      p("Push-билдирмелер системасы «Cheff» тиркемесинде колдонуучуларды жаңы рецепттер, мезгилдүү сунуштар жана тамак пиширүү эскертүүлөрү жөнүндө кабарлоо үчүн колдонулат. Ишке ашыруу процесси бир нече кадамдан турат."),

      p("Биринчи кадам — VAPID ачкычтарын түзүү. web-push китепканасы аркылуу:"),

      code("const webpush = require('web-push')"),
      code("const keys = webpush.generateVAPIDKeys()"),
      code("// keys.publicKey  — фронтендге"),
      code("// keys.privateKey — серверде сакталат (ENV переменная)"),

      p("Экинчи кадам — браузерден жазылуу (subscription) алуу:"),

      code("export async function requestPushPermission() {"),
      code("  const permission = await Notification.requestPermission()"),
      code("  if (permission !== 'granted') return null"),
      code(""),
      code("  const reg = await navigator.serviceWorker.ready"),
      code("  const sub = await reg.pushManager.subscribe({"),
      code("    userVisibleOnly: true,"),
      code("    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY"),
      code("  })"),
      code(""),
      code("  // Жазылуу маалыматын Supabase-ка сактоо"),
      code("  await supabase.from('push_subscriptions').upsert({"),
      code("    user_id: user.id,"),
      code("    endpoint: sub.endpoint,"),
      code("    subscription: JSON.stringify(sub)"),
      code("  })"),
      code("  return sub"),
      code("}"),

      p("Үчүнчү кадам — сервер тарабынан (Supabase Edge Function аркылуу) push жөнөтүү:"),

      code("import webpush from 'npm:web-push'"),
      code(""),
      code("webpush.setVapidDetails("),
      code("  'mailto:admin@cheff.kg',"),
      code("  Deno.env.get('VAPID_PUBLIC_KEY'),"),
      code("  Deno.env.get('VAPID_PRIVATE_KEY')"),
      code(")"),
      code(""),
      code("// Маалыматтар базасынан жазылуулардын тизмесин алуу"),
      code("const { data: subs } = await supabase"),
      code("  .from('push_subscriptions').select('subscription')"),
      code(""),
      code("for (const { subscription } of subs) {"),
      code("  await webpush.sendNotification("),
      code("    JSON.parse(subscription),"),
      code("    JSON.stringify({ title: 'Cheff', body: 'Жаңы рецепт кошулду!' })"),
      code("  )"),
      code("}"),

      ...gap(1),
      h2("2.3. Web App Manifest жана тиркемени орнотуу"),

      h3("2.3.1. Иконкалар жана Splash Screen"),

      p("PWA иконкалары ар кандай аппарат экрандарында жогорку сапатта көрүнүшү үчүн бир нече стандарттуу өлчөмдөрдө даярдалышы зарыл. Android аппараттарында adaptive icon технологиясы иконкасын ар кандай форма менен маскалай алат (дөңгөлөк, тегерек бурчтуу квадрат ж.б.). Ал үчүн maskable иконкаларды колдонуу зарыл."),

      p("Maskable иконканы туура жасоо үчүн «коопсуз аймак» принциби колдонулат: иконканын маанилүү мазмуну (логотип, сүрөт) иконканын жалпы аянтынын 80%ына жайгашышы зарыл — тышкы 20% маскалоо учурунда кесилиши мүмкүн. maskable.app онлайн куралы иконканы тестирлөөгө мүмкүндүк берет."),

      p("Splash Screen — тиркеме ачылуп жатканда 1–2 секунд көрүнүүчү экран. Chrome браузери manifest.json файлындагы background_color жана иконкаларды колдонуп, автоматтык Splash Screen генерациялайт. iOS Safari үчүн <link rel=\"apple-touch-startup-image\"> теглери аркылуу ар кандай экран өлчөмдөрүнө атайын сүрөттөр берилет."),

      h3("2.3.2. Install Prompt жана орнотуу тажрыйбасы"),

      p("PWA орнотуу тажрыйбасын жакшыртуу үчүн долбоордо атайын InstallPrompt компоненти ишке ашырылган. Бул компонент браузердин beforeinstallprompt окуясын тосуп, ыңгайлуу учурда (мисалы, колдонуучу 3-жолу тиркемени ачканда) орнотуу сунушун көрсөтөт:"),

      code("const [deferredPrompt, setDeferredPrompt] = useState(null)"),
      code("const [showBanner, setShowBanner] = useState(false)"),
      code(""),
      code("useEffect(() => {"),
      code("  const handler = (e) => {"),
      code("    e.preventDefault()"),
      code("    setDeferredPrompt(e)"),
      code("    const visits = parseInt(localStorage.getItem('visits') || '0') + 1"),
      code("    localStorage.setItem('visits', visits)"),
      code("    if (visits >= 3) setShowBanner(true)"),
      code("  }"),
      code("  window.addEventListener('beforeinstallprompt', handler)"),
      code("  return () => window.removeEventListener('beforeinstallprompt', handler)"),
      code("}, [])"),
      code(""),
      code("const handleInstall = async () => {"),
      code("  if (!deferredPrompt) return"),
      code("  deferredPrompt.prompt()"),
      code("  const { outcome } = await deferredPrompt.userChoice"),
      code("  if (outcome === 'accepted') {"),
      code("    setShowBanner(false)"),
      code("  }"),
      code("}"),

      p("Орнотуу диалогунан кийин тиркеме колдонуучунун операциялык тутумунун жумушчу тилкесинен (taskbar) же үй экранынан (home screen) ачылат. Орнотулган PWA standalone режимде ачылат — браузердин дарек тилкесисиз."),

      ...gap(1),
      h2("2.4. Оффлайн режим жана жергиликтүү маалымат сактоо"),

      h3("2.4.1. App Shell архитектурасы"),

      p("«Cheff» тиркемесинде App Shell Architecture колдонулган. Бул архитектурада тиркеменин «кабыгы» — навигация, баш аяк, жүктөлүү скелеттери — алдын ала кэшке жазылат жана оффлайн режиминде дароо берилет. Маалыматтар (рецепттер, ингредиенттер) тармактан жүктөлөт же оффлайн режиминде кэштен берилет."),

      p("App Shell-ди Workbox-тун precache конфигурациясы аркылуу ишке ашырылат: globPatterns: ['**/*.{js,css,html}'] менен бардык куруу артефакттары кэшке кириптирилет. Маршрутизация үчүн navigateFallback: '/index.html' конфигурацияланат — бардык бет жүктөлүштөрү кэштеги index.html-ге кайтарылат."),

      h3("2.4.2. React Query менен оффлайн маалымат башкаруу"),

      p("React Query (TanStack Query) — сервердик маалыматтарды кэштөөнү, жаңыртууну жана синхрондоштурууну автоматтык башкарган күчтүү китепкана. «Cheff» долбоорунда React Query Supabase сурамдарын башкаруу үчүн колдонулат жана анын кэш системасы PWA оффлайн мүмкүнчүлүктөрүн кеңейтет."),

      p("React Query конфигурациясы оффлайн режимге оптималдаштырылган:"),

      code("const queryClient = new QueryClient({"),
      code("  defaultOptions: {"),
      code("    queries: {"),
      code("      staleTime: 1000 * 60 * 5,   // 5 мүнөт жаңы"),
      code("      gcTime: 1000 * 60 * 60,      // 1 саат кэште"),
      code("      retry: 1,"),
      code("      networkMode: 'offlineFirst'  // Оффлайн режимде кэш колдон"),
      code("    }"),
      code("  },"),
      code("  queryCache: new QueryCache({"),
      code("    onError: (error) => {"),
      code("      if (!navigator.onLine) {"),
      code("        toast.info('Кэштеги маалымат көрсөтүлүүдө')"),
      code("      }"),
      code("    }"),
      code("  })"),
      code("})"),

      p("networkMode: 'offlineFirst' конфигурациясы React Query-ни тармак статусуна карабастан кэштен маалыматты оку деп программалайт. Тармак жеткиликтүү болгондо, фондо маалыматты жаңыртуу аткарылат."),

      h3("2.4.3. IndexedDB менен оффлайн CRUD операциялары"),

      p("Оффлайн режиминде рецепт кошуу, өзгөртүү жана жок кылуу операцияларын иштетүү үчүн IndexedDB колдонулган. Idb-keyval китепканасы IndexedDB менен жумуш жасоону жеңилдетет:"),

      code("import { get, set, del, keys } from 'idb-keyval'"),
      code(""),
      code("// Оффлайн режиминде рецепт кошуу"),
      code("export async function addRecipeOffline(recipe) {"),
      code("  const pendingKey = `pending_add_${Date.now()}`"),
      code("  await set(pendingKey, { type: 'add', data: recipe })"),
      code("  // Background Sync каттоо"),
      code("  const reg = await navigator.serviceWorker.ready"),
      code("  await reg.sync.register('sync-recipes')"),
      code("}"),
      code(""),
      code("// Service Worker sync окуясы"),
      code("self.addEventListener('sync', async (event) => {"),
      code("  if (event.tag === 'sync-recipes') {"),
      code("    event.waitUntil(syncPendingRecipes())"),
      code("  }"),
      code("})"),
      code(""),
      code("async function syncPendingRecipes() {"),
      code("  const allKeys = await keys()"),
      code("  const pendingKeys = allKeys.filter(k => k.startsWith('pending_'))"),
      code("  for (const key of pendingKeys) {"),
      code("    const operation = await get(key)"),
      code("    try {"),
      code("      await executeOperation(operation)"),
      code("      await del(key)"),
      code("    } catch (e) {"),
      code("      console.error('Синхрондоо ката:', e)"),
      code("    }"),
      code("  }"),
      code("}"),

      p("Бул ыкма колдонуучуга тармак статусуна карабастан маалымат кошуу мүмкүнчүлүгүн берет. Тармак кайта орнотулганда, бардык аяктала элек операциялар автоматтык серверге жиберилет. Ар бир операция уникалдуу ачкыч менен IndexedDB-де сакталып, ийгиликтүү синхрондолгондон кийин жок кылынат."),

      ...gap(1),
      h2("2.5. Долбоордун структурасы жана негизги компоненттер"),

      h3("2.5.1. Маршруттар жана бет компоненттери"),

      p("«Cheff» тиркемесинин маршруттары React Router v6 менен конфигурацияланган. Тиркеме авторизация маршруттары жана корголгон маршруттарга бөлүнгөн. Авторизациясыз колдонуучулар /login же /register баракчаларына гана кире алышат:"),

      code("const router = createBrowserRouter(["),
      code("  { path: '/login',    element: <LoginPage /> },"),
      code("  { path: '/register', element: <RegisterPage /> },"),
      code("  {"),
      code("    element: <ProtectedLayout />,"),
      code("    children: ["),
      code("      { path: '/',           element: <HomePage /> },"),
      code("      { path: '/recipes',    element: <RecipesPage /> },"),
      code("      { path: '/recipes/:id',element: <RecipeDetailPage /> },"),
      code("      { path: '/shopping',   element: <ShoppingListPage /> },"),
      code("      { path: '/profile',    element: <ProfilePage /> },"),
      code("    ]"),
      code("  }"),
      code("])"),

      p("Ар бир маршрут баракчасы React.lazy() аркылуу жалкоо жүктөлөт (lazy loading). Бул куруу убагында ар бир барак үчүн өзүнчө JavaScript чанки (chunk) түзүлүшүн камсыз кылат, ал эми биринчи бет жүктөлүш убактысын кыскартат."),

      h3("2.5.2. Supabase менен аутентификация"),

      p("«Cheff» тиркемесинде аутентификация Supabase Auth аркылуу ишке ашырылган. Supabase Auth email/сырсөз, Google, GitHub OAuth2 провайдерлерин колдойт. Токенди браузердин localStorage-инде сактоо жана автоматтык жаңыртуу Supabase SDK тарабынан башкарылат:"),

      code("const { data, error } = await supabase.auth.signInWithPassword({"),
      code("  email: formData.email,"),
      code("  password: formData.password"),
      code("})"),
      code(""),
      code("// Аутентификация абалын тыңшоо"),
      code("supabase.auth.onAuthStateChange((event, session) => {"),
      code("  if (event === 'SIGNED_IN') setUser(session.user)"),
      code("  if (event === 'SIGNED_OUT') setUser(null)"),
      code("})"),

      p("Маалымат коопсуздугу Supabase-тын Row Level Security (RLS) функциясы аркылуу ишке ашырылат. Ар бир SQL таблицасы үчүн саптарды кимге окуп жана жазуу мүмкүнчүлүгү бар экенин аныктаган саясаттар (policy) орнотулган. Мисалы, рецепттер таблицасы үчүн: колдонуучу жалаң гана өзүнүн рецепттерин окуй, кошо жана өзгөртө алат."),

      h3("2.5.3. Тиркеменин жалпы колдонуучу тажрыйбасы"),

      p("«Cheff» тиркемесинин UI/UX дизайны Material Design 3 жана Apple Human Interface Guidelines принциптерине негизделген. Tailwind CSS аркылуу жооп берүүчү (responsive) дизайн ишке ашырылган: мобилдик (sm:), планшет (md:) жана desktop (lg:) экран өлчөмдөрү үчүн ар кандай макет берилет."),

      p("Тиркеменин эки темасы бар: жарык (light) жана карачы (dark) режим. Колдонуучунун тема тандоосу localStorage-да сакталат. Тиркеме биринчи жолу ачылганда операциялык тутумдун темасы (prefers-color-scheme: dark) автоматтык аныкталат."),

      p("Жүктөлүш тажрыйбасы Skeleton загрузчиктер аркылуу жакшыртылган. Сервердик маалымат жүктөлүп жаткан учурда, реалдуу мазмунга окшош Skeleton анимациялары колдонуучуга тиркеме иштеп жаткандыгын билдирет. Бул Cumulative Layout Shift (CLS) метрикасын жакшыртат."),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("bolum_2_v2.docx", buf);
  console.log("bolum_2_v2.docx OK");
});
