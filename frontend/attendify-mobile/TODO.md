 # TODO: Générer le code pour l'application mobile de gestion des absences avec QR-code

## Étape 1: Mettre à jour package.json avec les nouvelles dépendances
- Ajouter: react-navigation/native, react-navigation/stack, expo-camera, react-native-qrcode-svg, axios, @react-native-async-storage/async-storage, react-native-svg

## Étape 2: Créer les nouveaux fichiers
- src/utils/constants.ts
- src/utils/helpers.ts
- src/hooks/useCountdown.ts
- src/contexts/CountdownContext.tsx
- src/utils/qrHelpers.ts
- src/components/QrButton.tsx
- src/services/SessionService.ts
- src/screens/ScanQrScreen.tsx
- src/screens/AbsencesList.tsx
- src/Navigation/AppNavigator.tsx

## Étape 3: Modifier les fichiers existants
- src/services/api.ts (étendre avec configuration Axios)
- src/services/AuthServices.ts (ajouter logique auth)
- src/services/ClasseServices.ts (ajouter CRUD classes)
- src/services/AttendanceService.ts (ajouter gestion présences)
- src/services/QrCodeServices.ts (étendre si nécessaire)
- src/Navigation/NavigationService.ts (étendre)
- src/Navigation/type.ts (ajouter types navigation)
- src/components/CountDown.tsx (modifier pour utiliser hook)
- src/components/Footer.tsx (intégrer QrButton)
- src/components/classList.tsx (améliorer)
- src/screens/Home.tsx (ajouter logique)
- src/screens/QrScreen.tsx (intégrer countdown et QR)
- src/screens/Sessions.tsx (ajouter liste sessions)
- src/screens/Profile.tsx (ajouter contenu)
- src/screens/InitList.tsx (ajouter logique)
- src/screens/FinalList.tsx (ajouter logique)
- App.js (configurer providers et navigation)

## Étape 4: Tester l'application
- [x] Vérifier compilation
- [x] Corriger erreurs TypeScript
- [x] Corriger erreurs tsconfig
- [ ] Tester navigation
- [ ] Tester génération QR
- [ ] Tester scan QR
- [ ] Tester countdown
