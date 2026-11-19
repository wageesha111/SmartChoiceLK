# Shop admin — how to use it

Website eke `/admin` page eken products add, edit, hide saha delete karanna puluwan. Phone eken use karanna hadala thiyenne.

## Log in

1. `https://<site-eka>/admin` ekata yanna.
2. Mul parata **First time? Create account** obala, admin list eke thiyena email eka saha aluth password ekak danna. Email ekata ena confirm link eka obanna.
3. Passe email eka saha password eka dala **Log in** obanna.

Password eka amathaka unoth **Forgot password?** obanna. Email ekata reset link ekak enawa.

## Aluth item ekak danna

1. **Add product** obanna.
2. **Add photo** obala item eke photo ekak ganna, nathnam gallery eken thoranna. Hondama photo: item eka issaraha idala, honda eliyak thiyena thana, item eka issarahin wena deyak nathuwa.
3. **Remove background** on karala thibboth, site eke anith items wagema item eka witharak penenawa. Preview eka penenna thappara kihipayak yanawa. Hariyata nathnam eka off karanna.
4. Name, brand, category saha price (Rs.) danna. Old price ekak dammoth discount % eka auto hadenawa.
5. Warranty, description, features (line ekakata ekak) saha specifications danna puluwan. Ewa danna one nam witharak dammata athi.
6. **Save** obanna. Item eka site eke kelinma penenawa.

## Wenas karanna / ain karanna

- **Edit:** List eken item eka obala, wenas karala **Save** obanna.
- **Mark out of stock:** Item eka sold out unama obanna. Item eka site eke thiyenawa, "In stock" tag eka witharak ain wenawa.
- **Hide:** Tika kalayakata site eken ain karanna. **Show** obala aye danna puluwan.
- **Delete:** Sampurnayenma ain wenawa. Aye ganna be.

## Owner ta (setup)

- Admin karanna puluwan emails thiyenne Supabase eke `shop_admins` table eke. Aluth kenek add karanna `insert into public.shop_admins (email) values ('name@example.com');` run karanna.
- Background removal walata server env eke `CLOUDINARY_API_KEY` saha `CLOUDINARY_API_SECRET` thiyenna one (`.env.example` balanna). Ewa nathnam photos Supabase Storage ekata yanawa, background eka ain wenne na.
