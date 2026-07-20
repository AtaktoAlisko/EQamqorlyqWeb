#!/usr/bin/env bash
# Генерирует адаптивные варианты фонового снимка Астаны.
#
#   ./scripts/gen-astana.sh [путь-к-мастеру]
#
# Мастер по умолчанию — assets/astana-master.jpg. Нужен горизонтальный
# снимок шириной от 2560 px (лучше 3840). Апскейл не делается: если мастер
# меньше целевой ширины, вариант собирается в натуральном размере.
set -euo pipefail

MASTER="${1:-assets/astana-master.jpg}"
OUT="public"
WIDTHS=(1280 2560)

[ -f "$MASTER" ] || { echo "нет мастер-файла: $MASTER"; exit 1; }
for bin in sips cwebp avifenc; do
  command -v "$bin" >/dev/null || { echo "нет $bin (brew install webp libavif)"; exit 1; }
done

MW=$(sips -g pixelWidth "$MASTER" | awk '/pixelWidth/{print $2}')
echo "мастер: $MASTER (${MW}px)"
[ "$MW" -lt 2560 ] && echo "ВНИМАНИЕ: ширина < 2560 px — на десктопе будет мыло"

for W in "${WIDTHS[@]}"; do
  T=$W; [ "$MW" -lt "$W" ] && T=$MW      # не растягиваем вверх
  sips -Z "$T" "$MASTER" --out "$OUT/astana-$W.jpg" >/dev/null
  cwebp -q 82 -quiet "$OUT/astana-$W.jpg" -o "$OUT/astana-$W.webp"
  avifenc -q 58 -s 6 "$OUT/astana-$W.jpg" "$OUT/astana-$W.avif" >/dev/null
  printf '  %-5s -> %spx  jpg %-6s webp %-6s avif %s\n' "$W" "$T" \
    "$(du -h "$OUT/astana-$W.jpg"  | cut -f1)" \
    "$(du -h "$OUT/astana-$W.webp" | cut -f1)" \
    "$(du -h "$OUT/astana-$W.avif" | cut -f1)"
done
