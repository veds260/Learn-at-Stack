// Real public posts from Stack Daily members, pulled from X and verified via the
// tweet syndication API (handle, avatar, text, likes are all from the live tweet).
// Static on purpose: no runtime API calls, so the marquee stays fast and reliable.
// To refresh, re-pull from X and update the entries below.

export interface CommunityPost {
  id: string; // tweet id, also used to build the link
  name: string;
  handle: string; // without the @
  avatar: string;
  text: string;
  likes: number;
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "2060737533705847180",
    name: "Sakata",
    handle: "0x_sakata",
    avatar:
      "https://pbs.twimg.com/profile_images/2058620661397168128/j2POHTpC_normal.jpg",
    text: "my unemployed days are finally over, im super happy to announce that I'm officially part of @stackdailyxyz, thanks a lot for believing in me, @CAPTA1NSCARLET, cant wait to cook with y'all <3",
    likes: 149,
  },
  {
    id: "2057706202138550701",
    name: "fly",
    handle: "flystoria",
    avatar:
      "https://pbs.twimg.com/profile_images/2019012027587362816/B3as896y_normal.jpg",
    text: "Happy to work with @stackdailyxyz, @CAPTA1NSCARLET and @xjuanito. Stack is my home; I don't have another. Putting all my best into this. I appreciate the honor, cap. 🫡",
    likes: 29,
  },
  {
    id: "2062172940402082063",
    name: "Daco",
    handle: "Daco1008",
    avatar:
      "https://pbs.twimg.com/profile_images/1896891537314725888/5yPX5GCd_normal.jpg",
    text: "Yesterday, @auntiepaca taught us that the most important thing to be a video content creator is to love yourself. Want to learn? Join the @stackdailyxyz telegram group",
    likes: 126,
  },
  {
    id: "2061460981981851710",
    name: "Arslan",
    handle: "0xarslan",
    avatar:
      "https://pbs.twimg.com/profile_images/1873591577446174720/FAJcqw4O_normal.jpg",
    text: "@stackdailyxyz: if you need to upskill yourself than this is the one. They do weekly workshops with top content creators + you can secure gigs",
    likes: 39,
  },
  {
    id: "2059278983993143770",
    name: "King 👑",
    handle: "the_mhikuun",
    avatar:
      "https://pbs.twimg.com/profile_images/1927748982639370240/2dBwhOtB_normal.jpg",
    text: "a great session hosted by @stackdailyxyz with @zaimiri as our speaker. you are missing out if you ain't in stack yet, the community is filled with builders, creators, BDs, and many more.",
    likes: 2,
  },
  {
    id: "2057016737707745456",
    name: "Aishwarya",
    handle: "aishdesign",
    avatar:
      "https://pbs.twimg.com/profile_images/1966761013581410304/ssJam6Lh_normal.jpg",
    text: "the stack daily community is showing so much love to my art lately. so now just sit tight and watch what else i cook. nobody's pfp is safe",
    likes: 79,
  },
  {
    id: "2060956734806733096",
    name: "Sakata",
    handle: "0x_sakata",
    avatar:
      "https://pbs.twimg.com/profile_images/2058620661397168128/j2POHTpC_normal.jpg",
    text: "My May recap: started a new creators journey, finally made it to emergenZ, got hired by stack daily, got some private deals, gained 350 followers. and you?",
    likes: 180,
  },
  {
    id: "2055272839125577881",
    name: "TAYO",
    handle: "TayoMeta",
    avatar:
      "https://pbs.twimg.com/profile_images/2027675453197307904/jylOKEij_normal.jpg",
    text: "just took my unemployability test at @stackdailyxyz. diagnosis: HR HAS NOTICED. Btw this was brutal 😭 Im trying okay 😭",
    likes: 14,
  },
  {
    id: "2062469182189437316",
    name: "bonney",
    handle: "bonney_kz",
    avatar:
      "https://pbs.twimg.com/profile_images/1948501690183024640/93Dl39OP_normal.jpg",
    text: "this example by @Elizacreatez really made me think: you can't walk with a wolf in real life, but ai can make it happen on screen. join @stackdailyxyz to learn somethinggg",
    likes: 10,
  },
  {
    id: "2061508308372959674",
    name: "Captain Scarlet 🩸",
    handle: "CAPTA1NSCARLET",
    avatar:
      "https://pbs.twimg.com/profile_images/1825417662400249856/vZH0nEPA_normal.jpg",
    text: "this is my actual family. stack daily is my web3 family. sadly, you can only be in one, but I highly suggest you join it",
    likes: 85,
  },
  {
    id: "2061895084690256258",
    name: "MacXVerse 👑",
    handle: "MacXVerseHQ",
    avatar:
      "https://pbs.twimg.com/profile_images/1944823963773009920/IWsE5ftT_normal.jpg",
    text: "From unemployed to officially joining @stackdailyxyz. Here's everything I learned during the transition 🔥",
    likes: 2,
  },
  {
    id: "2057158705024549320",
    name: "DIVINE",
    handle: "dvn_x7",
    avatar:
      "https://pbs.twimg.com/profile_images/1994857038384345088/dk_TdXKm_normal.jpg",
    text: "damn, Stack daily be makin' moves!",
    likes: 6,
  },
];
