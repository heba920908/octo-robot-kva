# Image Derivative Provenance

Source: kVA brochure assets supplied with this repository. No additional permission or rights are asserted. Originals remain unchanged under assets/media/brochure; retain and confirm publication permissions with the content owner.

Encoder: Sharp 0.35.5; libvips 8.18.7; aom 3.15.1; webp 1.6.0; mozjpeg 0826579.

Explicit settings (metadata stripped; no autorotation or upscale):

```json
{
  "avif": {
    "quality": 45,
    "effort": 6,
    "chromaSubsampling": "4:2:0",
    "bitdepth": 8
  },
  "webp": {
    "quality": 52,
    "effort": 6,
    "alphaQuality": 100
  },
  "jpeg": {
    "quality": 52,
    "mozjpeg": true,
    "progressive": true,
    "chromaSubsampling": "4:2:0"
  },
  "png": {
    "compressionLevel": 9,
    "adaptiveFiltering": false,
    "palette": false
  }
}
```

Targets are manifest-defined, capped and deduplicated per source. Source resolution is a hard ceiling, not a claim of full 2x availability. Actual dimensions and candidates are recorded below.

Logo role mappings show source-capped physical heights and identify unavailable full-density targets. PNG alpha is preserved; shared physical sizes deduplicate within each entry.

- header-32: 32px => 1x: 32px, 2x: 64px
- header-40-footer-hero-band: 40px => 1x: 40px, 2x: 80px; 24px => 1x: 24px, 2x: 48px; 200px => 1x: 200px, 2x: 241px (full 400px unavailable)

## Originals

| Source | Dimensions | SHA-256 |
| --- | --- | --- |
| assets/media/brochure/backgrounds/cable-tray-technician.jpg | 1115x837 | 28c8e93e497fdad0178af4a366f1c491b00f2727d425db964166cff2175ca8f9 |
| assets/media/brochure/backgrounds/cover-blueprint-tools.jpg | 740x556 | 1a45e49396ed53b0275613e9cbb4535cf6a9230d0d6e5af1e3087b284f6fc0e0 |
| assets/media/brochure/backgrounds/electrical-panel-technician.jpg | 387x668 | 8b79bcc8b96cf16d3e1a8fb2e2052a4c922132899ac7de3999712e6109ad3636 |
| assets/media/brochure/backgrounds/helmet-technician.jpg | 828x622 | 8d82e117ccd0a24182df4f04149227351de65fe6fba6a76280688af1ffe1be4d |
| assets/media/brochure/backgrounds/wiring-technician.jpg | 1047x787 | 7e8e17a871fc96e9e601e14fae9517f81674c59ec7886c533c88a6412ef166fd |
| assets/media/brochure/projects/acometidas-media-baja-tension-01.jpg | 694x599 | db821633470ad16a3f7c3c413ed1548460af8e7f7761146ad07f32c1900daaa9 |
| assets/media/brochure/projects/acometidas-media-baja-tension-02.jpg | 916x596 | c5604b44e1577da713631329dbb7d8522b53cd680ae32b638020d1124f485f0e |
| assets/media/brochure/projects/canalizacion-cableado-alimentadores-01.jpg | 1024x769 | bb783b895aae5b6efec7cde8c5b3898bbeecbb0f33732e1db29fe70543a551bd |
| assets/media/brochure/projects/canalizacion-cableado-alimentadores-02.jpg | 425x319 | 0296afa05c2d82d77fd0bbce94d92a98c14f454fc66fbf8861287084af229c2a |
| assets/media/brochure/projects/canalizacion-cableado-alimentadores-03.jpg | 840x736 | 3c23d16c43a57038ed96891ac6d9551f806987e0beb6237067a1652af968bb04 |
| assets/media/brochure/projects/canalizacion-cableado-alimentadores-04.jpg | 981x736 | c7c5c75b9178ea1673cd7b81b0e4b0f845f8dc7c748e29ef61b6076347bbdb9d |
| assets/media/brochure/projects/canalizacion-cableado-alimentadores-05.jpg | 414x335 | 8523dbd570d3478825ce54d0920fe0a9ceb57846615e5625c9b474c62256cd57 |
| assets/media/brochure/projects/canalizacion-cableado-industrial-comercial-01.jpg | 455x367 | d406da49d234c77d3b6f481c15c447672b927ce84d398d02576568e84598b0ba |
| assets/media/brochure/projects/canalizacion-cableado-industrial-comercial-02.jpg | 1148x545 | ad1d5bb3a19107165c1b4f026c01fc073376748d4f3f55b8ef53a63632de8099 |
| assets/media/brochure/projects/canalizacion-cableado-industrial-comercial-03.jpg | 557x401 | 31950d72421111ab370ae8c1e1fbee959a3eb84fc3336699d5f7d5f83ca18de9 |
| assets/media/brochure/projects/canalizacion-cableado-industrial-comercial-04.jpg | 439x792 | 9a29a23165040c76edb6a90493fbedc6f098aed2efaddb5c09902a7838465a7f |
| assets/media/brochure/projects/larousse-01.jpg | 638x837 | 3502f8fe06222ffa9f284fabfd518429229ea059fbd17b0d206014182d8c29ef |
| assets/media/brochure/projects/larousse-02.jpg | 399x574 | 12d319643e9c00c944d21d2a21d1a83fd6705de5d25d9ce104637c59c1d571ab |
| assets/media/brochure/projects/maniobras-equipos-electricos-01.jpg | 1172x551 | cd67f77c1758e59968ad6b0f84266a2f642dade00b396183919daee9a8dbbae0 |
| assets/media/brochure/projects/mantenimiento-equipos-01.jpg | 1308x664 | a17c9816e316b91c4b7154e6bf66a9e9ba545f36f8d9f30b79f20fd0f50ecda2 |
| assets/media/brochure/projects/red-ambiental-01.jpg | 900x1181 | bc7ac36cdc313b4ca36edf90b6e5c9c3795c2c3e1d45a3a1c4edb8237fbb8574 |
| assets/media/brochure/projects/red-ambiental-02.jpg | 399x576 | 3ec941863209565f37409b6538a928d1b7863e97283b7faf8e8cb1460f596348 |
| assets/media/brochure/projects/sistema-tierras-pararrayos-01.jpg | 1295x628 | 6399a917a501401cbbb46c4f758671f548c81129259fc8645f85e7fec3b3fccb |
| assets/media/brochure/projects/site-paralelo-redundante-farmaceutica-01.jpg | 451x597 | 6b40784031e83f047a3ba57732916be5ac9af24f2fa93a9134b0c05ce5a56d3e |
| assets/media/brochure/projects/site-paralelo-redundante-farmaceutica-02.jpg | 998x720 | 2470d27a462c77bccdcdd6dfc8f60be583d669b488e529ee53f346af7a783b6e |
| assets/media/brochure/logo/kva-logo-white.png | 459x241 | e70514c6fbecbcc86c15b8d3f6b83c28dc1d335ade7e423354dcb7182c25d730 |
| assets/media/brochure/logo/kva-logo-white.png | 459x241 | e70514c6fbecbcc86c15b8d3f6b83c28dc1d335ade7e423354dcb7182c25d730 |

## Derivatives

| Path | Bytes | SHA-256 |
| --- | --- | --- |
| media/backgrounds/cable-tray-technician-320.avif | 6841 | 1a9c8db111aa2e1b6ebab88626064eba40d1d395e3de38e69830ac04795ed3fd |
| media/backgrounds/cable-tray-technician-320.webp | 11150 | d8215f01523068b3c0637ff15de684eef30374f1856ff23bb66fc7663e587e31 |
| media/backgrounds/cable-tray-technician-320.jpg | 10414 | 0c084827ad620ed649b63dcf7ddcd28891d0d4d661ae5b7115685da88b68fb8a |
| media/backgrounds/cable-tray-technician-640.avif | 18709 | d458e7ff2786eb72b66f7e266ce3ca7ab1bdba6b952fa6fc5e6da5c46f70dff7 |
| media/backgrounds/cable-tray-technician-640.webp | 30850 | d5486ae400e37455d2ea1d439b9eba45b4322c9bc3c17309afdbb6c8b41c14eb |
| media/backgrounds/cable-tray-technician-640.jpg | 31811 | 992050577dba1f8d3f060372b1d0dfc88e31a65bdada6c0b2279a0f47edd4033 |
| media/backgrounds/cable-tray-technician-960.avif | 33312 | 351f9f2314dd43ec5ff65f77a6ede9994019eae383fa1eb0e6fd138f37382269 |
| media/backgrounds/cable-tray-technician-960.webp | 52070 | 730e3179edc84393d72163cd9cf5a2cdb5a8742651b1800ea8679d09dc681a8b |
| media/backgrounds/cable-tray-technician-960.jpg | 59738 | cad161abbd35ebf945f22d06a5af81e96f7321c0cd8194572315434455717d14 |
| media/backgrounds/cable-tray-technician-1115.avif | 44211 | d8dd12aae4a0c77bdeec7935592bce0a39bec74b37ca0b5b43153878932725f3 |
| media/backgrounds/cable-tray-technician-1115.webp | 66394 | 3422a297fb3f5b6c6835e8c0d1079a79bfd951e673e4756662d823a28ca3b211 |
| media/backgrounds/cable-tray-technician-1115.jpg | 82055 | c088c5d7627cb04422d13ea5810c01e63ea4f185d1876cfbf2ddadaeb6a619be |
| media/backgrounds/cover-blueprint-tools-320.avif | 8477 | dbb6e19b1d003b47e46f6da8554d4931036db800a811900f30d0e9c8b8f5c8f0 |
| media/backgrounds/cover-blueprint-tools-320.webp | 13086 | 76845f59d868bad92b50fc3e21e8b1c3439d469fefc1225e73966245a0c74de5 |
| media/backgrounds/cover-blueprint-tools-320.jpg | 11092 | 2f15005512423c64b5cd782a487f6a404635f565677d95c6fc0dd2ba7a30b8c6 |
| media/backgrounds/cover-blueprint-tools-640.avif | 26181 | 2969f0024189de2c711b657b70bd73a5b9cb45b491481d096000a50e618695f0 |
| media/backgrounds/cover-blueprint-tools-640.webp | 40900 | 101956a4782bca1916a3fa2e1c60f0cbd8e224408fb3da550e03b8780b9bf1ca |
| media/backgrounds/cover-blueprint-tools-640.jpg | 38341 | 55de406c9d488d1bc539b40c6392447dffda8c32358dd989baded8362cf2433b |
| media/backgrounds/cover-blueprint-tools-740.avif | 34085 | 5e39bac10104b6b898bbeda343660c885ad9e1e89a1b37e48f29d868c9ec5ca4 |
| media/backgrounds/cover-blueprint-tools-740.webp | 52848 | 562c61958df348b1a11436002ba2b5c6d42086cad7faf1462be17d3521bae03b |
| media/backgrounds/cover-blueprint-tools-740.jpg | 49931 | cf7de3eb4d66f548274297ad498402da2417b61e8ae44ca6780b802a108309d9 |
| media/backgrounds/electrical-panel-technician-320.avif | 7585 | 52837d5f6a64e1c4ddacc37ed43512de125327f9ada4e2b51560e608fec07d8d |
| media/backgrounds/electrical-panel-technician-320.webp | 10630 | 3e6237b8e7b1c6f490fcef9d65d8c2ac097555f4ab897bb5372f5b0d8638daec |
| media/backgrounds/electrical-panel-technician-320.jpg | 13687 | 641d186644e3fc19a2f70ca2e2ee606b60c146c3ba9baa94be7b52455284fba9 |
| media/backgrounds/electrical-panel-technician-387.avif | 10400 | b7d2449e11f6a85df174961b0c3905bc8c0a2b30942ab70a009b6fe61f8996c4 |
| media/backgrounds/electrical-panel-technician-387.webp | 13980 | 8ebc93c9e137d9faa7bd19a03808153299a436bf84880725352be10591407747 |
| media/backgrounds/electrical-panel-technician-387.jpg | 18813 | c849c333ef13164d539cb15df7e81900c15ef75525e51eca0f2824a15d3bb05d |
| media/backgrounds/helmet-technician-320.avif | 5454 | 1d0e2f28d091d30b5db0e455c70f7844bb347b0853294c0b6beaa149385c915c |
| media/backgrounds/helmet-technician-320.webp | 8104 | a21b69523ed47169ff9e601c5337194311a1b7d38d5276cd2b7fd45381193c77 |
| media/backgrounds/helmet-technician-320.jpg | 8546 | 425e5b5114ca501d4c6a962764755c01c73ce55cf95b6c1ff2c13bbd9a007652 |
| media/backgrounds/helmet-technician-640.avif | 15625 | 0aedb837801d1ffc59f9edf9bcec72cafa10b9d59b905cd036a785e4bc97b595 |
| media/backgrounds/helmet-technician-640.webp | 21150 | 4cc2a2b54a2721bd39ec43908b95aae340113479399d985eab337d7cfe63e2dd |
| media/backgrounds/helmet-technician-640.jpg | 25548 | 587e20763b7de43ae0ce294dd5b631b0eeffc8669eb5b1cf5c014bc6c05a0d16 |
| media/backgrounds/helmet-technician-828.avif | 23966 | e4d7bc4da706bfb0478f61b60e490a9f72fe1621926b4c6869b7df6bfc9707f5 |
| media/backgrounds/helmet-technician-828.webp | 30034 | 4a9b549cf63d1d9956ee080a0e594683ec17b3eab93f6ac43fcedee5d28a1ad0 |
| media/backgrounds/helmet-technician-828.jpg | 38999 | 93dc0061d43e769a0632fd8e2fbc29f5d12442d778488b446cea0f5527dbaf91 |
| media/backgrounds/wiring-technician-320.avif | 5551 | 53e9e65d4a5a506f6ef23835bdc6fb0fa614d934d286763dfd4efba2faa2c3b2 |
| media/backgrounds/wiring-technician-320.webp | 8268 | 3b1b612dac12d7e1a105d9600d5746354094e7ef1e2cc50d49eb60956f444931 |
| media/backgrounds/wiring-technician-320.jpg | 8631 | 60d8cdf5affe3fce504baa21fd2be809acb82481894ae9185eb4f12465da9ac1 |
| media/backgrounds/wiring-technician-640.avif | 13614 | f31e782911fda50af03b536c708907952b297f8d5eb1ab02adcfce3ca37ff40e |
| media/backgrounds/wiring-technician-640.webp | 20524 | eef75f4b97785c63153dac24232515654377bd5ba85fa5836ca729b2d550a74e |
| media/backgrounds/wiring-technician-640.jpg | 23794 | 57a24213ff76fe9277c6b7d484ac096a59c63a9d930f9e2c27489ee24ca7f284 |
| media/backgrounds/wiring-technician-960.avif | 22464 | 45654ff9defb0f29163ca177db181151fa1fee778b0c43ca2054638d7961edea |
| media/backgrounds/wiring-technician-960.webp | 33044 | 689cced21338774aa4d415d3c3dde9a4e239552713552308f0ffbafa3198b138 |
| media/backgrounds/wiring-technician-960.jpg | 42551 | 1cef85ac7539f6a855b3274f2ba8e50d79cd6d62eae6b11bc7d407947f4df0ee |
| media/backgrounds/wiring-technician-1047.avif | 26768 | 52f896093270f08eaf8ea43c06fdbe8cfed4827e8188eb3eff1947f092fdbbc3 |
| media/backgrounds/wiring-technician-1047.webp | 38160 | 3a1590d694f40d91ae284a05363f90836dc117c4f2f3482960e1f478ca30b843 |
| media/backgrounds/wiring-technician-1047.jpg | 53117 | d8eb041acab9a47a86a7dd65fcebbad8ed2eff9dd78e023391b5c9f0ce91f08a |
| media/projects/acometidas-media-baja-tension-01-320.avif | 5827 | 55515a861b39e3d740038f184a714df34f8459b213808007447e0e599e6ad3e0 |
| media/projects/acometidas-media-baja-tension-01-320.webp | 9070 | cd5d15e9561776f68502823b79f414a60fc151793a31707964bd02c4ce898426 |
| media/projects/acometidas-media-baja-tension-01-320.jpg | 9318 | 301e83d5824aa83661b2f5412aa55f3d34bfdac2bb26e70d4c027b7bdbdedcdc |
| media/projects/acometidas-media-baja-tension-01-640.avif | 17459 | b08740cd369a59d271efe3a0f3ec7041015e3891e5054dcf09287520fe00e8c5 |
| media/projects/acometidas-media-baja-tension-01-640.webp | 24838 | 99692e7ff130bd31fa1b9e5393863ad197014b29697af36ab085d33a58ce142e |
| media/projects/acometidas-media-baja-tension-01-640.jpg | 29420 | d9b7552246d04c582df9b6633db1f1f5d19eec6635aa3d21497c4bbef0251b32 |
| media/projects/acometidas-media-baja-tension-01-694.avif | 20759 | cbc3f1d652d73e814b7a21bb8702c05ea643956641154c3ff3b46cdbad69aab9 |
| media/projects/acometidas-media-baja-tension-01-694.webp | 29328 | 562ecd32458fb08edba4eaf08e3a6562f7be7586b8e0f619b3ce1fee875cd4cf |
| media/projects/acometidas-media-baja-tension-01-694.jpg | 35095 | c6bec5707d72a2b538f799563f1f7ca5b3c9f1c187b1229f40407fdb45a3b9e9 |
| media/projects/acometidas-media-baja-tension-02-320.avif | 4032 | ce69a3c5b76155b27041d7353f4bc698c5fcf41d1d90f4098c4a7de8588bb040 |
| media/projects/acometidas-media-baja-tension-02-320.webp | 4916 | bd8f98503fb3edace45023cefd52238119c48b82620ea2e74c988fbea42da913 |
| media/projects/acometidas-media-baja-tension-02-320.jpg | 6110 | 6c8215373d55ff80d1e01e2057388c8ca1fe229951a53e385ab01543e96e0d73 |
| media/projects/acometidas-media-baja-tension-02-640.avif | 10435 | 5a70c3086d01fb1c8c78a6e8962f2f3d1e6c950e695ea34baa985c1390264329 |
| media/projects/acometidas-media-baja-tension-02-640.webp | 11820 | 90308858c802ac65ee8cd6ef061013abefe80dcce6ce30804e9ce90eb9854813 |
| media/projects/acometidas-media-baja-tension-02-640.jpg | 16421 | 7fde9c3defad9bccb612bd282cac6214e84eabcfaaf17b498abefdb46d5fb696 |
| media/projects/acometidas-media-baja-tension-02-916.avif | 18685 | f2c347f6e46bf7670d8548137bf1cb88ea8caed2b432ff86ab9981a3f0d93222 |
| media/projects/acometidas-media-baja-tension-02-916.webp | 19590 | d3cc6dd5c6221ff7b58962715287a57bf8ec7a258fdf836ada27fba5e40bbaa4 |
| media/projects/acometidas-media-baja-tension-02-916.jpg | 28876 | b23899b7f6126650dd74c52877dec285e81455f709f0581599e5022214b1200a |
| media/projects/canalizacion-cableado-alimentadores-01-320.avif | 3512 | 6590795aec160a7ea0e9b32ef56bbf18659edb32e9911749474dbad1c068ee51 |
| media/projects/canalizacion-cableado-alimentadores-01-320.webp | 4520 | f6a44e500d4fd42221a066529c7b3e66abffefc7ed561645a0304f7e40e3403c |
| media/projects/canalizacion-cableado-alimentadores-01-320.jpg | 5478 | 9fb9786f7e8934b3e54281ec215bdb677bf6752e9c6d0a79f9d1d270eafd21ce |
| media/projects/canalizacion-cableado-alimentadores-01-640.avif | 8834 | 02d3da7e2e3c5d868a35bda9378cb60111172c807ee678fbea6a45dace879ef9 |
| media/projects/canalizacion-cableado-alimentadores-01-640.webp | 11346 | 842a84d67d9be6c153602e03dceab68cc353fec3f8def31581e1ee8504be1dd2 |
| media/projects/canalizacion-cableado-alimentadores-01-640.jpg | 15308 | 1ac7f11b86421f8f7ae63bb9ef9fd5ad6d234bcb359a22f83034c166e920e156 |
| media/projects/canalizacion-cableado-alimentadores-01-960.avif | 14697 | 2c3df56a08ecd9f77249d8f3bb7175716485aa6de9e4c96cc09bb6707f4d7415 |
| media/projects/canalizacion-cableado-alimentadores-01-960.webp | 18712 | 5f4d14390294908b94713f4d80a2dd212076c8aa0716d3ff68b887f6b9007b3d |
| media/projects/canalizacion-cableado-alimentadores-01-960.jpg | 27414 | cd1782f774e725a35e5c3a3177f1913273db28f1b5b44230936c6536f07b910a |
| media/projects/canalizacion-cableado-alimentadores-01-1024.avif | 17406 | a37b6945e1cd6af7d47a34ce05c0b6ffcfd62f62586adba4ccfc5b7f375bef95 |
| media/projects/canalizacion-cableado-alimentadores-01-1024.webp | 21070 | bdd4be5aba6d2fcef39592c9576f2ed7225e82a91bbb7c8786e9d5cb51b60385 |
| media/projects/canalizacion-cableado-alimentadores-01-1024.jpg | 33620 | ab276f10225be1f8e45ff6da75b303c14680c7d132b148d5cb74f5170f0bdf5e |
| media/projects/canalizacion-cableado-alimentadores-02-320.avif | 5027 | d9c7755f197c5240eac9ee3d565369816f065669c594ffaa72f139413163d2b8 |
| media/projects/canalizacion-cableado-alimentadores-02-320.webp | 6744 | f79ce74e81b4eeb713c66f8fd742ec91a161745b2ec78b362be44350a4905cb7 |
| media/projects/canalizacion-cableado-alimentadores-02-320.jpg | 7222 | 64053fa7e5d8c25846c6478b3ca9f09a25ffbb0b4b8c96a4d546b640de196680 |
| media/projects/canalizacion-cableado-alimentadores-02-425.avif | 8228 | 100ac861a22f7ef4223297729239267c4b233ff0a9c71e4cf09b06b4c889366f |
| media/projects/canalizacion-cableado-alimentadores-02-425.webp | 10906 | 8e4b8eb91b3f939689bac139d3b22fcc16f0fc295cfdc3b0620926058472151f |
| media/projects/canalizacion-cableado-alimentadores-02-425.jpg | 11887 | 34971af3e64982d10e439768b204019264651a08a01dc639b8676db533fa9b35 |
| media/projects/canalizacion-cableado-alimentadores-03-320.avif | 7021 | 17e59d70638d02bf5e375e40ca4ef1e83a6106fb0c119b337219d96b7227bb79 |
| media/projects/canalizacion-cableado-alimentadores-03-320.webp | 11226 | f27aa552e4428cdd5e38a9fea4a36ed640c4d29e6b0b0c2eab593f015ed8fe0a |
| media/projects/canalizacion-cableado-alimentadores-03-320.jpg | 11460 | aa9d86e007853898e6b3acec31ebe56b0add14f465a0784b6c70bb70e3b3a9d9 |
| media/projects/canalizacion-cableado-alimentadores-03-640.avif | 17934 | c86a4e05f5380c6f743dd943c772f950495992351b3b5c2558a527db00369f21 |
| media/projects/canalizacion-cableado-alimentadores-03-640.webp | 27358 | 0212ddc75295ce123e2e6831fdad015de1faf75c8b21b79c8f678a454bef8a8d |
| media/projects/canalizacion-cableado-alimentadores-03-640.jpg | 33127 | e3a559b7100ef27d93416b8b1e1bfd04d4750afd4ac812da00418851ae035344 |
| media/projects/canalizacion-cableado-alimentadores-03-840.avif | 27058 | f7f1163331c2a911f77dbc01495a1aed407a6efde6cc9d07dd1b1493b559ece6 |
| media/projects/canalizacion-cableado-alimentadores-03-840.webp | 39716 | 9c5263ddcadb3d0e40218ba1078a6960d2142328fcb0ff6fd5d69e9890553375 |
| media/projects/canalizacion-cableado-alimentadores-03-840.jpg | 51585 | 79090ff416c968f414da7c096e0576ef093662a1fc4fac96b31801f7adc3f48c |
| media/projects/canalizacion-cableado-alimentadores-04-320.avif | 7683 | 14e0a432828033f86eb0bdca50c9f3c38d6dcfa8d93585a6ffc936d4a0320d83 |
| media/projects/canalizacion-cableado-alimentadores-04-320.webp | 12312 | 8bc03d8f7328ece390926a98f26bddf69335acc35cc520104c373fd4fa39dec0 |
| media/projects/canalizacion-cableado-alimentadores-04-320.jpg | 11472 | f057415e3e251da3770b011b99f40dedcaafbf47c0288e5cc326896c52bbe131 |
| media/projects/canalizacion-cableado-alimentadores-04-640.avif | 22035 | 51fc5175ee2047117a04e4674916e94112ef8fa34ca46615456771ad87e078e7 |
| media/projects/canalizacion-cableado-alimentadores-04-640.webp | 35572 | cc724637dd8822d8764dc6174ef6612f7f6357137f7136a98a731f87ae74fb7d |
| media/projects/canalizacion-cableado-alimentadores-04-640.jpg | 35787 | a89e739530d6b712ba1661532ce5d1eab64c2557fae9bd128a0c91ab739cfe69 |
| media/projects/canalizacion-cableado-alimentadores-04-960.avif | 41000 | fb285231bb7d911a2cc534efdb02527db03a73921ab14977151c0aa27dacce9f |
| media/projects/canalizacion-cableado-alimentadores-04-960.webp | 62566 | 8ff2776f96f7abebc72ccbb99e99aee5d8af5419d008b74afedf854dd920f6af |
| media/projects/canalizacion-cableado-alimentadores-04-960.jpg | 67790 | 581f0bd3ee1ac57cf73a7394dfa5d9b09dd121a7146d72f9639d1e275c2f6a90 |
| media/projects/canalizacion-cableado-alimentadores-04-981.avif | 46902 | 9e226e945b1fde373bd0c693861990faffec0662f779e6186024e28bd702cb14 |
| media/projects/canalizacion-cableado-alimentadores-04-981.webp | 68482 | cdafd09b672e370950ea6f97ad78846664b78ab81a9bb8d6a4b73764a1be0a5f |
| media/projects/canalizacion-cableado-alimentadores-04-981.jpg | 76257 | b1b6e348b6f821f416bdfbea9829ce28b47c8af06e68675a72ad99302e22ea5d |
| media/projects/canalizacion-cableado-alimentadores-05-320.avif | 7206 | c148824db9bc4f7c2e22d5fffaa6f8a3790d652d32c21a3ebe03bf8a99974e02 |
| media/projects/canalizacion-cableado-alimentadores-05-320.webp | 11762 | 96f7d1001e57d7a7d2723b05793c9f56f3466f2cf8dba0224ec2a046258ce74f |
| media/projects/canalizacion-cableado-alimentadores-05-320.jpg | 11153 | 1851c172b6a23915cbca1139b5937daa9c145715ce5b729b1e88067245adc9b8 |
| media/projects/canalizacion-cableado-alimentadores-05-414.avif | 11463 | b107f58eaa931d970cde3f6b6632654d2d38a16de75468a15e7d84991d8d251f |
| media/projects/canalizacion-cableado-alimentadores-05-414.webp | 17512 | 9810099fdfcae602cc21512d3afb3fd615806339c7834c0e28bfd7f505b99d4c |
| media/projects/canalizacion-cableado-alimentadores-05-414.jpg | 16907 | 345d0ee4a2112762ee4c04184f44fb49f2c1ee67155d6c8f6a6fc14dcc3ca609 |
| media/projects/canalizacion-cableado-industrial-comercial-01-320.avif | 4354 | 0efcbaba995a0ae239da2fc08839f6afac969b12e285234cc891a9d76225aaec |
| media/projects/canalizacion-cableado-industrial-comercial-01-320.webp | 5584 | 841e695766b1c4042808c5a0d6648a1e9acd1d936b017823560fae6cb2129d25 |
| media/projects/canalizacion-cableado-industrial-comercial-01-320.jpg | 6759 | c588cd514587d02e354063cd7883e098935d52fe472f9210ba231aef2c9df36c |
| media/projects/canalizacion-cableado-industrial-comercial-01-455.avif | 8519 | ca38edd5e29a74b9efd484467130184f247f72c6d3d25e3c52370ef0a23f2556 |
| media/projects/canalizacion-cableado-industrial-comercial-01-455.webp | 9918 | e3408bbd45230fe8df3edfe0c4ee5dfad5f4fd251e404e3abd60ee1a90c67596 |
| media/projects/canalizacion-cableado-industrial-comercial-01-455.jpg | 12052 | 2220c5fd590ca060eaf094207842bfe71c163cf1e49f76a70f7c1b2e75c06dba |
| media/projects/canalizacion-cableado-industrial-comercial-02-320.avif | 4145 | da86ba0ef2c67ad1177078e1be7e00a22a26e9bd1b2ab5a95509aafdb4ac6b3e |
| media/projects/canalizacion-cableado-industrial-comercial-02-320.webp | 6938 | cdff6f68a9855125102dfeb233da6b25ce7c5e9d580a3a075e12ddfb82d13a45 |
| media/projects/canalizacion-cableado-industrial-comercial-02-320.jpg | 6578 | da5f3971e17720ca64cd889a536879d777fb2f00a576ffa1a1f85e64948f10aa |
| media/projects/canalizacion-cableado-industrial-comercial-02-640.avif | 11469 | af9fb9270a502736fb4a2129b20a21506878de6fd772623ea72247cb5932642a |
| media/projects/canalizacion-cableado-industrial-comercial-02-640.webp | 18610 | 086cc61e121c0a714a7ca1d13f3dd697e528f9b464252503de189c0b696a73c2 |
| media/projects/canalizacion-cableado-industrial-comercial-02-640.jpg | 21118 | 769ebdbf83dfe0d024c385c814cf8ac453938db1b1811d3b2aa81aed5823b031 |
| media/projects/canalizacion-cableado-industrial-comercial-02-960.avif | 19335 | d3fbedac388513e6c290eba07fca3ad495e7047301439cb7208c6a5a38ccc257 |
| media/projects/canalizacion-cableado-industrial-comercial-02-960.webp | 30664 | 21b6989e69e856f0516bd06b25e6f5c6f8a7779e3b120b054edfb8ae9e2a1008 |
| media/projects/canalizacion-cableado-industrial-comercial-02-960.jpg | 39193 | ee1a7ac8cdcca7e294cb1fbeec1f33d4af292f0183bd72ba8e2025f26e8e51cb |
| media/projects/canalizacion-cableado-industrial-comercial-02-1148.avif | 26433 | 5207ef3a47cb1254cbd63e9b3b6fd6a73990d48dda7f46ab186a36fe02215d3f |
| media/projects/canalizacion-cableado-industrial-comercial-02-1148.webp | 39532 | 5f4587ec63a55644b409d1dd05a0b02d29762a394b89470c2eea2c95f677bd7f |
| media/projects/canalizacion-cableado-industrial-comercial-02-1148.jpg | 55465 | cd3716fba8f1b6b6daaf99f5932090f8a7256cfc71c0ba21ecd08d9b808a26ae |
| media/projects/canalizacion-cableado-industrial-comercial-03-320.avif | 5155 | 9869da169acfa0cec7241dd153f9ea28b113a8a4c63041204323cd8f436eaf4f |
| media/projects/canalizacion-cableado-industrial-comercial-03-320.webp | 7096 | d2dc9854c9fcc3233c38b4e4706461a38dabcd6c27637f2d9f44edda2f1ccaf7 |
| media/projects/canalizacion-cableado-industrial-comercial-03-320.jpg | 7276 | 1c313197f0cfdcfd2e74a1ecfbfb16a76465116554f2fcd74fd8b7f26ec860f9 |
| media/projects/canalizacion-cableado-industrial-comercial-03-557.avif | 13457 | 645ab4a71794f83a325e0904d3dc85410177ebb0eb109e42b8f7aee1ddc885e1 |
| media/projects/canalizacion-cableado-industrial-comercial-03-557.webp | 18096 | 326b91531d33b34040373575761c76fa46ee22d59c2de9e72da3ff7795b8f881 |
| media/projects/canalizacion-cableado-industrial-comercial-03-557.jpg | 19265 | a65cbbe2e72a567f699f34c79e298cfe432de45c698a7d80b9000c1fb9b7054a |
| media/projects/canalizacion-cableado-industrial-comercial-04-320.avif | 4416 | 340e1fcd62e04d8596200b10940a60acff1ccd31a61265833ae17f4e9e453d9e |
| media/projects/canalizacion-cableado-industrial-comercial-04-320.webp | 4384 | b32b7b5123e8c907ce25317ab638223d4e3879df6be5abe3c3a6a83c00930ce1 |
| media/projects/canalizacion-cableado-industrial-comercial-04-320.jpg | 7068 | c556829b5cdb79ae030630b6310462afb6d4dd7b667f235e730ea5e263286ea9 |
| media/projects/canalizacion-cableado-industrial-comercial-04-439.avif | 7689 | e0136b6b86eb5421cde61780a56552e72dd85c1fd652f9fba38ded20d33d2d38 |
| media/projects/canalizacion-cableado-industrial-comercial-04-439.webp | 7224 | 71fcc6a1191e716c2c3c8dae81db656be2b7fba81126a692794b8497b8cf5293 |
| media/projects/canalizacion-cableado-industrial-comercial-04-439.jpg | 11920 | 681b611d30e141b80e0252f3cbee676897a2b4722a9908d0fb9b8bf7588893d4 |
| media/projects/larousse-01-320.avif | 10010 | 8e996241ade2f421a72c5a6a0a91bb1878ac5d946fa3b91c75826f9a8a28b1c0 |
| media/projects/larousse-01-320.webp | 16696 | 62e8608005d2e038b81aa2f25b6040c6a86a5b2c9d7a906af6290e2500a3f416 |
| media/projects/larousse-01-320.jpg | 17840 | 8708bd6dcec1e3daa0a7e0c6eed14b39e2984a4c18cabc5871fdb502f76c0569 |
| media/projects/larousse-01-638.avif | 26068 | 754c1a69085eb0b32d648e5efdb18ac5b7cea1bc756eb4debf6f60c11c491932 |
| media/projects/larousse-01-638.webp | 40250 | 362ff5dd50cda6d7932c2ddb0a0056724bbe77e72729434732cb7e544889b60e |
| media/projects/larousse-01-638.jpg | 50774 | f2bf43ea6eb796e36cbf1a827bccc357c4cc59abd2d83a52b5985671ea731ea9 |
| media/projects/larousse-02-320.avif | 7658 | df0b91bded63e4e56483fe4ce6738e1ddb8848d313387139a82bfff5d37679e2 |
| media/projects/larousse-02-320.webp | 10212 | d3d932c63a43268b9a1baecd13a8fbfeaadc2b28d88c63c5555c695d67c6bac8 |
| media/projects/larousse-02-320.jpg | 13106 | accdebd226e876b32c7fe1c6a8c9e70308801621ecbb2c28aef33e9bd83d6652 |
| media/projects/larousse-02-399.avif | 11677 | 848c0c1ffb6bd7b484865fdceba2118c848b3f5dab48f93374d577b65a313e27 |
| media/projects/larousse-02-399.webp | 14792 | 7ad641598dd89fbfee13c29a41792166137650c2dbb06af12ff30248b16a6947 |
| media/projects/larousse-02-399.jpg | 19249 | 06ba0855c045d29d8ae8457cfbf885a6b6944dfc31b77015b01fc8ceb330026b |
| media/projects/maniobras-equipos-electricos-01-320.avif | 3546 | 8dd6a2e1c61d6705f0f3a277273a8d055ef0a78d2c15ff8a723ed4985fe3f7f5 |
| media/projects/maniobras-equipos-electricos-01-320.webp | 5170 | a24e0ec179cf8f3ed17c4612fc09660a7550ab08c4cc212f7a815325d6dc250e |
| media/projects/maniobras-equipos-electricos-01-320.jpg | 5619 | e461c8189b53b69f477f3e2fe00e63c56cbafc6b0385adc3379bacc07f7e1828 |
| media/projects/maniobras-equipos-electricos-01-640.avif | 9695 | dcd9942f0a3c33149efe9a90138fe3b596817ef2f07f2bdaff11cf0ae593c49d |
| media/projects/maniobras-equipos-electricos-01-640.webp | 13848 | 1bbf8d6b1a75f4b83d40b56bdddea8f096fe2db96b8b3fe5f70071487db71675 |
| media/projects/maniobras-equipos-electricos-01-640.jpg | 16852 | 4870c2a84e261003a8ef123f387bf5fe66327dd56fbd40d3f08c38dae4bb459a |
| media/projects/maniobras-equipos-electricos-01-960.avif | 18617 | 75698470924ae6f85bdcd68991fc52bd75b0851c9142ab4c5ba004f288a6fe8c |
| media/projects/maniobras-equipos-electricos-01-960.webp | 24932 | 322f74adf8b35f58bd3d94e927a0a5ea071bf873be54c2d2960c80ede3639a2c |
| media/projects/maniobras-equipos-electricos-01-960.jpg | 32348 | aa5df764c0b25c4180ffe3cce9b0a6bc5a940bab27e02d630f4486fda59207a8 |
| media/projects/maniobras-equipos-electricos-01-1172.avif | 28903 | 8b3e04f64b9f71c68bf68b855046d4516968cdb33c0c48703f84a5ff4d6dd000 |
| media/projects/maniobras-equipos-electricos-01-1172.webp | 35446 | daf33a77b87a8c2a082ca97296e5a05070631c01dc6a8cf491200f807f091f2b |
| media/projects/maniobras-equipos-electricos-01-1172.jpg | 50158 | 7cf0740ef4d4d4c60433f3dfa078e1b5aa31c09f1e0b07b760a9923557f3d7cf |
| media/projects/mantenimiento-equipos-01-320.avif | 5084 | 2e674a7311628e0d8022039a5d0bdb724556239917535f8584072ca4023908de |
| media/projects/mantenimiento-equipos-01-320.webp | 7726 | adad12953c580e16c5ec143d703305f044de959581ed5b9af5794e65abe220d6 |
| media/projects/mantenimiento-equipos-01-320.jpg | 7471 | 9eb8a7e75aa60f59a75c63b70ebfeadfd7117cf8eb5713ff359f1e950d8112f6 |
| media/projects/mantenimiento-equipos-01-640.avif | 14283 | 19beeea8c524374dcd86b8963ae1e741be93a719bdc5ce6f49076cc48f1b4feb |
| media/projects/mantenimiento-equipos-01-640.webp | 20880 | ff787bc86fc1890fd1f13ee87bfec6b9d6b2aae6fc13b6d74fe3d0ac61c259b3 |
| media/projects/mantenimiento-equipos-01-640.jpg | 22136 | ac649616ccd659936b4b7e03af191d9541d9dd4aec517cf30554d34e2a0169f6 |
| media/projects/mantenimiento-equipos-01-960.avif | 25423 | 0aa897454174ebf625a91c9d2351fbffc3bf5f4f2a4442e05c8f530dff95b403 |
| media/projects/mantenimiento-equipos-01-960.webp | 35448 | 87034f860df72b4d4756722041575339c1c1b44b2f31b014cc281df8fe0fea29 |
| media/projects/mantenimiento-equipos-01-960.jpg | 39983 | 9c596db8df5001073a8252be267ccd234027e4bf08b8b5be1f78a63a4d770e2d |
| media/projects/mantenimiento-equipos-01-1280.avif | 37895 | d9f76278af72f637789c819aa0d98dbfb3a59313b07b6c05c80493cd8a6909ab |
| media/projects/mantenimiento-equipos-01-1280.webp | 50996 | e7bb46c177251c5dd2befa51646572d65e97dfe0c26c5e43e7a0b546d2c4a9e2 |
| media/projects/mantenimiento-equipos-01-1280.jpg | 61683 | 717f5608400cd9fbd419aae6a5fa0cdea8bb705b4b5195a375371b4ad14a00f2 |
| media/projects/red-ambiental-01-320.avif | 9719 | 9e3551feb33a6c9ec325d949188b9b0faf82084b27af2f650c59b0adb8597221 |
| media/projects/red-ambiental-01-320.webp | 15612 | a22e33f20a5c971a6cb0cad927c6250fa16d6417398220ac9bcaae24d9d6445a |
| media/projects/red-ambiental-01-320.jpg | 14413 | 11385f810d06dda48d6712408d96721ab013679c5d48035e33088a09e5c2b3ab |
| media/projects/red-ambiental-01-640.avif | 34983 | 18777d188f0c034ad2ed0469cdc1f516c0cbc2ebd605c8d1cefcd5ca270deed9 |
| media/projects/red-ambiental-01-640.webp | 60774 | 0060a7ff9ef5578b8b8cadc9563bb6dc6120d938533c5f9704933fc8312d71d1 |
| media/projects/red-ambiental-01-640.jpg | 52022 | b7df3bf9ff2b6ca00b8862f3b93641607d34c659b840b918318539fb39e429c7 |
| media/projects/red-ambiental-01-900.avif | 74261 | bc25b225491e565cf72fcd14c508989c62cf5d31bcb831f84b86de34e3da423d |
| media/projects/red-ambiental-01-900.webp | 117134 | a8e08af5da1ab0cd2077ce8f8356cf643bfc17a0b67f8f4afe6de731bc0ee7c1 |
| media/projects/red-ambiental-01-900.jpg | 107868 | 7fff70f9ecd2744f10afa3e4b18f82acca5d7add25e8a2aefaf5e24b3b4da4bc |
| media/projects/red-ambiental-02-320.avif | 11574 | e9aa84376b2a8bba79f78bbf69a29ee547c1b85c670117d86f504c7e55e68d04 |
| media/projects/red-ambiental-02-320.webp | 18240 | 52fdcff10cfada1bec43b63debb9dfb038a5542e6457180a00a10a3b7d9f3255 |
| media/projects/red-ambiental-02-320.jpg | 16200 | 9a8fec6093e3318ef763fb018588d3c4d2dcb6c8ff0e1934064f44c4657326c8 |
| media/projects/red-ambiental-02-399.avif | 18736 | b378e942a59e83e848b53701623dfcaf5a9aefeb5ae2f45bcfd5cffd0f6d33b1 |
| media/projects/red-ambiental-02-399.webp | 28450 | 5798fd38b0711034d57e99804e7f3cdf0a4788486190be473894ee9b1f660e6a |
| media/projects/red-ambiental-02-399.jpg | 24985 | 14080aedf5e7e64fabf6ae90382b223fe8843416894bac0d3949c15d77e94555 |
| media/projects/sistema-tierras-pararrayos-01-320.avif | 5074 | 0c8c1fd6493b7400b49c9cf45634eac83eead01d6df46662a403e86ca0d298c8 |
| media/projects/sistema-tierras-pararrayos-01-320.webp | 7846 | 43d5930ce09e7eab661116a735bbe2cbac1176e52bd1bb39cc49da1fa9e5d0d1 |
| media/projects/sistema-tierras-pararrayos-01-320.jpg | 7216 | 8545f600b3062c0affccf32c42ae2a68d487fd29be299bc6b40015eef7dbb6a9 |
| media/projects/sistema-tierras-pararrayos-01-640.avif | 15539 | 00ce69c958dfb6be7063faef0d8fd314eeea6287507718fadf87bdae7864590b |
| media/projects/sistema-tierras-pararrayos-01-640.webp | 24862 | 93cc3211b7ad2e0849de840417140a4bbd5b6c9a8c23dd78b874ec70d5a8a6af |
| media/projects/sistema-tierras-pararrayos-01-640.jpg | 22832 | 291328f4e77f8230d95ce11e0ea1067b2063ba13322aa6c49619f64afd85d43a |
| media/projects/sistema-tierras-pararrayos-01-960.avif | 31535 | 2bb197a364a021683d0c719ad605826b327f53cfcd75e12c9a68b72cd5be92c8 |
| media/projects/sistema-tierras-pararrayos-01-960.webp | 47390 | 739b2f4da8d23d4471da6e3811cdd6177b19fb38db80f1833c12110f5924ff75 |
| media/projects/sistema-tierras-pararrayos-01-960.jpg | 45332 | 95d560803fdf6eccbd0f9fa7c175472b25ce799f5631b361763f08dd2b176bda |
| media/projects/sistema-tierras-pararrayos-01-1280.avif | 51056 | 508dbfced919a7b42e074886d5740f6a7d266f52fa338c66b9f66ffa8dc1453b |
| media/projects/sistema-tierras-pararrayos-01-1280.webp | 74710 | 374a842f923cee3b1fac06a7da213f2f583ab09a4e428436864032d1652d170d |
| media/projects/sistema-tierras-pararrayos-01-1280.jpg | 72919 | 300a7725674e648c26e80aa7691085b84c1c1dd330d2ae441ec0d4b4ae01281f |
| media/projects/site-paralelo-redundante-farmaceutica-01-320.avif | 3175 | 2dbaf12026d3dbc8a1799589e027b86487dd37a757ea9ab359c3f22725eeb61b |
| media/projects/site-paralelo-redundante-farmaceutica-01-320.webp | 3604 | d4f66a531b1459505c61f08bcb43b2246d943cd1801aed78675c7b7284375896 |
| media/projects/site-paralelo-redundante-farmaceutica-01-320.jpg | 5846 | ca7ee2c8f593bac0eca35e8550285d026852571e0773333cc13ee00bcc4c5fa5 |
| media/projects/site-paralelo-redundante-farmaceutica-01-451.avif | 4883 | b6d25f90e2788da40a52b2560a47bd6e6e6696c09dd148e42489a5e93650bbbb |
| media/projects/site-paralelo-redundante-farmaceutica-01-451.webp | 5642 | 96a68257f1457b331650a9e0df1864fdee689f9b36e13cb2c7220aa63d776741 |
| media/projects/site-paralelo-redundante-farmaceutica-01-451.jpg | 9572 | 3a3a48c7de5b8678b6fd23539548e45c6ff2bf60907012a441514269aee6a453 |
| media/projects/site-paralelo-redundante-farmaceutica-02-320.avif | 3265 | 280ab8475282864165225192fefaf2155204fe13a04a2de18eac313a330c2580 |
| media/projects/site-paralelo-redundante-farmaceutica-02-320.webp | 3530 | d4848497cec11a58f76148b9f6820d2f66ef0e2cead3d7976b1e79e8f69c8170 |
| media/projects/site-paralelo-redundante-farmaceutica-02-320.jpg | 4717 | 74c59634927fae91ff22cadf5e07548b3d0d3cec87a57ab36e250d9525b23f3d |
| media/projects/site-paralelo-redundante-farmaceutica-02-640.avif | 9486 | 446edc9305bcb9a549762df71eabcc78238899590d92c6c9c4bedea1d445a591 |
| media/projects/site-paralelo-redundante-farmaceutica-02-640.webp | 10708 | effc9d2954cf0ca5666ac3742d994423ab977cdcfe9f4549cbf216363c744784 |
| media/projects/site-paralelo-redundante-farmaceutica-02-640.jpg | 13995 | ccb7adad3b33006fe3e942230bab8eb755a2380825b10d460ba9dc22960d87f6 |
| media/projects/site-paralelo-redundante-farmaceutica-02-960.avif | 18405 | e9bd1b7a8b5bc2f848e325d74932fb02b7cd10be450abff5e2f48791b886785d |
| media/projects/site-paralelo-redundante-farmaceutica-02-960.webp | 20478 | e49629cd59a7a1d8565f44f24dbed039eb00c9a499251166f82ce468910a1901 |
| media/projects/site-paralelo-redundante-farmaceutica-02-960.jpg | 27284 | 346e627dbe03385c4844bf5ed312172e16c1e58b8e0c7a99c2f448c8e13028d7 |
| media/projects/site-paralelo-redundante-farmaceutica-02-998.avif | 22916 | 9caceef6c1a7b981ef023816d0788bd79ab8fa85d11bb70cafedd98c8d54fb03 |
| media/projects/site-paralelo-redundante-farmaceutica-02-998.webp | 24274 | a4663be452bd7eebf30f05bc46d875d556ee44e5cff458f963b67dc005818099 |
| media/projects/site-paralelo-redundante-farmaceutica-02-998.jpg | 32568 | 354a7288fb2fee33d3f47bb3102a1540b3c4ffe937dbed9dfef618fb04152711 |
| media/logo/kva-logo-white-32.png | 1406 | d56fed862e7ace515085217df546f18f2c64e728c4d6cfecd06f634253b7f329 |
| media/logo/kva-logo-white-64.png | 2873 | 1057837c1201ae50d1d3b6694f63eb97db01a5118d40dd0c07ce261044179e5f |
| media/logo/kva-logo-white-24.png | 1008 | 589dc32883dfd1d1b20a4c7ab74d70f493d12ab728d1c895cf28a0ad4495d050 |
| media/logo/kva-logo-white-40.png | 1755 | 75b8d25b547f85c72ad84dda92399b70e9dc02be26ca9f920221f32be04f0e75 |
| media/logo/kva-logo-white-48.png | 2094 | 1591e4e388e2f5864f00e7658d4fcf2ed6f21168aee57c9ac35e9067cfdbef81 |
| media/logo/kva-logo-white-80.png | 3523 | c7c56dec871ba8eaa63a0d75508a3bd9f0b0f89acbdc3631d7f0d0d54cfd735b |
| media/logo/kva-logo-white-200.png | 10614 | 78d020a14c0e01abdbbc4f6a9cdc2d581433522cbffaccab41106688796ba2a8 |
| media/logo/kva-logo-white-241.png | 8179 | 67814add12e6619c2ea5b3909d46f8f64888078284685df0ee2c5c7121b2d4fb |
