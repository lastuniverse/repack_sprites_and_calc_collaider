# repack_sprites_and_calc_collaider
repack spritshits and calc collaider for all frames

ставим нужные пакеты (canvas и прочее)
```
npm install
```

закидываем в папку `source.units` исходные спрайтлисты юнитов


правим под них конфиг для парсинга спрайтов `source.units/humans.unit.js`

запускаем перепаковку
```
node repack.js
```
