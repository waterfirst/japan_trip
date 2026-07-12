# japan_trip

`실시간 통역` 탭은 브라우저 음성인식으로 한·일 음성을 받고, `backend/`의 Google Cloud Text-to-Speech `Chirp 3: HD` API로 번역문을 재생한다. 백엔드는 Application Default Credentials를 사용하며 키를 프런트엔드에 저장하지 않는다.
