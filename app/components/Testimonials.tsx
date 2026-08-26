"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Avatar from "./Avatar";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Stars from "./Stars";
import { springy } from "./motionPresets";
import { countryFlag } from "../lib/countries";
import { supabase } from "../lib/supabaseClient";

const testimonials = [
  {
    quote:
      "I had looked at the website. I just need to know what I need to do to make the website available. And I appreciate all that you have done. Sorry so much for the lateness!",
    name: "npascoe66",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/e12e3951c656731c4b6ac73c53c8881c-1707088562790/649c3796-d5aa-45df-ac4e-d6d28766c650.jpg",
    rating: 4.0,
  },
  {
    quote: "Great and efficient work.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote:
      "Absolutely recommend! Responsiveness and thoroughness is above and beyond!",
    name: "tonycontri",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/5270ebe8590b5ee9acdd6c3b58b3a83d-1717011813713/46437ee0-43d2-4ab3-8115-effd71f79af1.PNG",
    rating: 5.0,
  },
  {
    quote:
      "Loved Thiraj's work! Excellent communication and problem solving. His design was on-point!",
    name: "sancerpro",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/357f70bb7a580ba6ed033f630b752fea-1643143527244/792c2a44-05c8-4ff5-84b8-6f809cd834d0.png",
    rating: 5.0,
  },
  {
    quote:
      "well, is really a good fere lance , i'm going to work again with him for sure",
    name: "lokolapalma",
    country: "Spain",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ea-1f1f8.png",
    flagAlt: "ES",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/fd76bc4c245207e58b29a931bd5df8af-1774852108645/05c64968-1f05-4a19-9577-2a133197916b.png",
    rating: 4.3,
  },
  {
    quote:
      "I was not responsive but he was. Very patient with us and we greatly appreciate him! Great work",
    name: "ritarosew",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/27064a0c474d986405461dacd76c60dd-748629831635865667.0325642/81E54A97-20E8-4F9B-AB71-F755AE1661B4",
    rating: 5.0,
  },
  {
    quote: "Quality and efficient work as always. Will return.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote:
      "His rating tells you everything. He was easy to communicate with, very professional, most of all, his work is excellent!! Do not waste your time looking for a website designer. He is the best of the best, I guarantee. My new website looks wonderful, and it will bring me more clients (I hope). Thank you, Thiraj!!!",
    name: "kaylappg11122",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Great work and very responsive",
    name: "mageekesh",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Fantastic seller! Great service!",
    name: "terracecrawford",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2472fd82955d67fedface7fe71f63880-8718981684002395.346466/E3D79832-A883-4369-ACA8-941A792636BA",
    rating: 5.0,
  },
  {
    quote: "Very helpful with details, professional at all times!!",
    name: "carolinasbazaar",
    country: "Mexico",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1f2-1f1fd.png",
    flagAlt: "MX",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2d8f560d6c0139de113ef1f789371921-761401311555084266.804465/850F36AB-5CC7-46A6-BA5B-04093516DC08",
    rating: 5.0,
  },
  {
    quote: "Very beautiful creation",
    name: "amiranystrm",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "I've had many projects with this seller and he is always very professional and efficient. If there are any changes needed, he will address. Great communication. Great service. Highly recommended. You will not be disappointed working with this seller.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote: "Amazing work…great communication and very friendly!",
    name: "terracecrawford",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2472fd82955d67fedface7fe71f63880-8718981684002395.346466/E3D79832-A883-4369-ACA8-941A792636BA",
    rating: 5.0,
  },
  {
    quote: "Wonderful to work with! Great communication and very friendly.",
    name: "terracecrawford",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2472fd82955d67fedface7fe71f63880-8718981684002395.346466/E3D79832-A883-4369-ACA8-941A792636BA",
    rating: 5.0,
  },
  {
    quote:
      "As a repeat customer, I am pleased with the delivered work. Seller prompt and efficient in completion of the website. Will use again.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote:
      "Always responds timely & within reason. There was some miscommunication between us, but issue was resolved quickly. Looking forward to working with him in the future.",
    name: "denisewilson984",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Thank you for the website!!",
    name: "staydsvr",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "This is such a GREAT company to work with! Excellent communication, fast turnaround time and even with the time difference he was on point with this project. Will work with him again for sure.",
    name: "urbanallstar",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/eba46402713da88d7307d1f65fb318db-1611076370782/b4016baf-245c-4c57-89b1-933a205d8852.jpg",
    rating: 5.0,
  },
  {
    quote: "Highly recommend!",
    name: "sandimanhas",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/ebc43a7edd582dd689ef27f887c3f5b6-1020140151666504683.941029/5DD1606F-E36E-4BFD-83B6-57B71F17268A",
    rating: 5.0,
  },
  {
    quote:
      "AMAZING WORK! highly recommend. he is so patient, is inquisitive, and makes sure to check in. Timely as well. Amazing amazing amazing work!!",
    name: "amiranda84",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/86df1d88fd7efad46248ac6949de0101-1601411732952/014c475b-9d8d-46fe-b858-394d5092d952.png",
    rating: 5.0,
  },
  {
    quote: "Resonded quickly, always professional and responsive.",
    name: "marioust",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "It was a pleasure working with designfactory10 (Thiraj)! Overall services were delivered in a timely manner. Great with communication, very patient and accommodating. Will definitely consider using services again for future projects!",
    name: "evtwenty",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/10c4b5cb7e07040231ad4a3c2d3ee7e0-1658893153375/cb209630-0eea-4834-a73b-5746a2bb7ae0.jpeg",
    rating: 5.0,
  },
  {
    quote: "Great communication and work",
    name: "christennant699",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "This designer is fantastic to work with... very communicative, easy to work with, and does exceptional work!",
    name: "terracecrawford",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2472fd82955d67fedface7fe71f63880-8718981684002395.346466/E3D79832-A883-4369-ACA8-941A792636BA",
    rating: 5.0,
  },
  {
    quote:
      "Great communicator, patience and really did an AMAZING Job 🥳 Thank you !",
    name: "eydiseir",
    country: "Iceland",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ee-1f1f8.png",
    flagAlt: "IS",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/9c497090b88e88a20a420f2cd14967bb-1720443385463/8ca86d25-014e-46f0-9e34-41fbf94c84da.jpeg",
    rating: 5.0,
  },
  {
    quote:
      "If you are looking to work with someone dependable, friendly and easy to work with, look no further. Thiraj made what I predicted to be a daunting experience, enjoyable. Communication was clear and easy. I am a wordpress novice and a visual learner.",
    name: "hcms1515",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "second time we are working together and it won't be the last",
    name: "elmo11080",
    country: "United Arab Emirates",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e6-1f1ea.png",
    flagAlt: "AE",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/8b3af2e58e8bee4b6c6dd0d21ad1715c-1566718387958/ddc25fd7-53c3-4026-b759-cb068922e884.png",
    rating: 5.0,
  },
  {
    quote:
      "Not enough words to describe Thiraj. Truly a professional...patient with my requests and delivered something that was more than I imagined, all while me pestering with revision requests, system issues on my side. If you are planning to get a site done Thiraj is YOUR MAN, you wont be disappointed.",
    name: "hemalpatel500",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Very good experience again. Would highly recommend",
    name: "freddiewyles",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/f62dc74a4324a4f68676f94bf98268ad-1106045461658843559.856533/DC94C892-BD4D-45DE-87AC-D24100510FC5",
    rating: 5.0,
  },
  {
    quote: "It was quick and well delivered.",
    name: "marielareyes",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/profile/photos/64981382/original/photo.jpg",
    rating: 5.0,
  },
  {
    quote: "Been doing excellent work for me !",
    name: "amiranda84",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/86df1d88fd7efad46248ac6949de0101-1601411732952/014c475b-9d8d-46fe-b858-394d5092d952.png",
    rating: 5.0,
  },
  {
    quote:
      "Wonderful experience with Thiraj! I will definitely work with him for my next project. Thank you so much",
    name: "zaraestakhr",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/085127e977993d51e29e1a12d3ef1141-773876751676938452.871763/51CEF25A-AB7F-4CD0-A89D-6CAE15FC9370",
    rating: 5.0,
  },
  {
    quote: "AMAZING WORK!!!! AMAZING DESIGN. I'm sooo happy!!!",
    name: "amiranda84",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/86df1d88fd7efad46248ac6949de0101-1601411732952/014c475b-9d8d-46fe-b858-394d5092d952.png",
    rating: 5.0,
  },
  {
    quote:
      "Such a great service. Will definitely use again. Highy recommended.",
    name: "alegnakween",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Communication and delivery was on time. Easy to work with",
    name: "nesslami20",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "The seller worked to correct errors and was very patient.",
    name: "bookerwiggins",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Thiraj is great at what he does, delivered on time and quality.",
    name: "freddiewyles",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/f62dc74a4324a4f68676f94bf98268ad-1106045461658843559.856533/DC94C892-BD4D-45DE-87AC-D24100510FC5",
    rating: 5.0,
  },
  {
    quote: "Thank you sir, I appreciate your work.",
    name: "blacktiechauff4",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/476fbb9f1464f4187d468b7c8e55b0a8-1075181831648844044503/JPEG_20220401_161403_4155480654756219899.jpg",
    rating: 5.0,
  },
  {
    quote: "Always a great experience. Will submit next order soon.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote:
      "I was very happy with all aspects of this service and my website looks fantastic!",
    name: "marketingesty",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/28cf664d0326b748c96e8e02f852e203-1034418421625539782.714726/B0268CD3-3AB6-478D-9199-D6F3D2350E50",
    rating: 5.0,
  },
  {
    quote:
      "Great service, understood exact specifications and provided the product swiftly.",
    name: "ckc111",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar: null,
    rating: 4.7,
  },
  {
    quote: "On-time delivery with good quality as described.",
    name: "ramanakotte",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Absolutely amazing, very professional.",
    name: "jessedegroff",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Designfactory10 (Thiraj) is very professional, I'm more than happy with the website he created for me. I would happily recommend him to anyone.",
    name: "brettbiggar",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Amazing work! So wonderful to work with!",
    name: "terracecrawford",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2472fd82955d67fedface7fe71f63880-8718981684002395.346466/E3D79832-A883-4369-ACA8-941A792636BA",
    rating: 5.0,
  },
  {
    quote: "Prompt. Great communication. Will return again.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote:
      "Great communication and attention to edits. I am going to have them design another site for me.",
    name: "waterloux",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/8cafe1fc3b79f81c5e59b70e40455923-1668214799340/14717dd8-3692-4d79-a3f5-51fd7946046c.png",
    rating: 5.0,
  },
  {
    quote:
      "Great job very helpful, trustworthy, and patience. Looking for a website designer you at the guy",
    name: "haynesgarden",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Great to work with, work was completed ahead of deadline.",
    name: "khariseglasgow",
    country: "Turks and Caicos Islands",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1f9-1f1e8.png",
    flagAlt: "TC",
    avatar: null,
    rating: 4.3,
  },
  {
    quote:
      "Thiraj has always done a great job for me, and I keep using his services. This time is the sixth time I have used him. His communication skills are excellent and he takes direction very well. I will continue to use him whenever I nee help. His prices are good too. Gordo from Canada.",
    name: "gordofrombaynes",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Forever my go to guy for web design. You’ve earned a permanent client.",
    name: "asiannahfoster",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/35550574dc4162d8a80a5bd4ce578812-705122311632761999.869842/76D8D215-49DB-430B-8B1D-EA0980CFCF0C",
    rating: 5.0,
  },
  {
    quote: "Excellent service. !!!!",
    name: "thomsondespatch",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/674f99f24bce7c798694d9097963c05d-201588981785430338.62724/C25D0376-EBEF-4005-BD66-0A01012C20E8",
    rating: 5.0,
  },
  {
    quote:
      "There are no words that I feel could express my appreciation for Designfactory10. He is the most kind, professional, understanding and reliable graphic designer that I have ever met. He has come through for me every time that I've needed him, and he amazes me more and more each project.",
    name: "tmbwell",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/e54cc4987ad4c4f7cae69709e3c89520-414223171589814948922/JPEG_20200518_081548_6870123661914495522.jpg",
    rating: 5.0,
  },
  {
    quote: "Excellent Work.",
    name: "sillykidgames",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/2fadec57073a72324ec9fbc0c1010cb9-1534783395596/8694f109-a99d-499c-a94c-e6597669e118.png",
    rating: 5.0,
  },
  {
    quote:
      "I enjoyed working with the seller. The process was easy. We had clear communication since day one until the project was completed. I want to keep him on my team to continue updating my website.",
    name: "schery75",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Was great to work with",
    name: "jonathanm364",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar: null,
    rating: 4.0,
  },
  {
    quote:
      "A+++ Amazing seller. This is the second time I've worked with him. Will work with him again : )",
    name: "maxdune",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "He did exactly what I l wanted. Very patient with me until I was satisfied with my results. Thank you!",
    name: "rsmith26",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Thank you so much DesignFactory10! I really appreciate you, and everything that you have done for my project. Your work is always amazing, and you are hands down one of the sweetest sellers that I have ever encountered.",
    name: "tmbwell",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/e54cc4987ad4c4f7cae69709e3c89520-414223171589814948922/JPEG_20200518_081548_6870123661914495522.jpg",
    rating: 5.0,
  },
  {
    quote:
      "A+++ Excellent job. Would love to work with this seller again for my website needs.",
    name: "maxdune",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Designfactory10 has once again exceeded my expectations! He took my vision, and turned it into a beautiful work of art. My entire team absolutely loved our presale banner. He even delivered to days earlier than expected! I am a forever customer. Than you Designfactory10!",
    name: "tmbwell",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/e54cc4987ad4c4f7cae69709e3c89520-414223171589814948922/JPEG_20200518_081548_6870123661914495522.jpg",
    rating: 5.0,
  },
  {
    quote:
      "I honestly don't even know where to start with designfactory10. He is hands down, one of THE BEST designers on Fiverr. He communicated with me every step of the way, and was extremely understanding when I asked him to make corrections due to typos or errors on my end.",
    name: "tmbwell",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/e54cc4987ad4c4f7cae69709e3c89520-414223171589814948922/JPEG_20200518_081548_6870123661914495522.jpg",
    rating: 5.0,
  },
  {
    quote:
      "Speed and responsive. Great Communication and understanding of our needs.",
    name: "laben1",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "...and he does it again. this is the 2nd website he has design for me and I couldn't be more happy with the outcome Very responsive with edit and changes.",
    name: "anishasniche",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Service was very thorough and professional.",
    name: "janiesseb",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Delivery was on time and seller communicated during the whole process. Would recommend and use again.",
    name: "korey2016",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Easy to work with, clear communication",
    name: "entrepreuner19",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "It was a pleasure working with him. He was very response and make sure all changes were made. I can’t wait for our next project for my event studio !",
    name: "anishasniche",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Excellent work! Thiraj is patient, knowledgeable and communicated very well! My site came out beautifully. I would definitely recommend his services!",
    name: "mizzprime",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "I have used designfactory10 before and he did such good work that I have decided to use him exclusively for all my web-page needs. My web-site is on GoDaddy and he knows that platform very well. His prices are affordable and after you use his services, you will think they are a bargain. Gord Dreger from themugmaker.com",
    name: "gordofrombaynes",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar: null,
    rating: 4.7,
  },
  {
    quote:
      "I think Thiraj..... Designfactory10 is very good and responsive at what he does. It turned out I wasn't ready for him. I had to ask for a few extra days to write some of the text that I wanted to write myself. He is also a great value. Gord from themugmaker.com , .",
    name: "gordofrombaynes",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "My experience was great, very good communication and any changes that needed redoing, was done in a very timely manner. Some minor grammatical corrections needed but overall a great job! Thank you",
    name: "solescape2011",
    country: "Canada",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1e6.png",
    flagAlt: "CA",
    avatar: null,
    rating: 4.3,
  },
  {
    quote:
      "Thiraj is amazing , don’t think just order . You won’t be disappointed . He understood concept clearly and delivered beyond my expectation . Highly recommended .",
    name: "nilofernz",
    country: "New Zealand",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1f3-1f1ff.png",
    flagAlt: "NZ",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/da44cef6e580aa8569bd5fe0db0ea77c-1091405751624251129.108994/B5381947-56EB-4350-B64E-02699948A8D0",
    rating: 5.0,
  },
  {
    quote: "Excellent service and product quality!",
    name: "dinero544",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Excellent work and excellent experience!! Got the job don’t quick and very professional",
    name: "alstokes30",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/cb020e4cb648e32d13044ecaba71de5e-722939771623276982.948977/36E5576C-A5ED-4BE5-B92E-DE4D877FD3FC",
    rating: 5.0,
  },
  {
    quote:
      "This seller has been excellent to work with. I needed so many edits on my website and the seller didn't even blink an eye and made all the changes within time. The seller is also very responsive and reliable. I would recommend this seller to anyone who wants to create basic websites.",
    name: "prateek2686",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "My experience was awesome. Great service and delivery that superceded my expectations! I will definitely use him again",
    name: "ccsdessertsdesi",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Seller implemented requests for the landing page and was responsive and friendly! Pleasure to work with.",
    name: "user70026640",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Seller completed task with minimal direction. Seller educated buyer of the available options. Great communication.",
    name: "shannajefferson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/3c6f8ed429abba1d318f91cade98fd58-1512758432605/fb8cbb9d-ae81-480e-b8ec-af34389fb6d0.jpg",
    rating: 5.0,
  },
  {
    quote: "Great communication and very professional!",
    name: "nateli",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/918510c8e21f2abd8367d522cd426f4d-1625939214508/fed04645-4c9b-49e0-967e-9e10ae31b21b.jpg",
    rating: 5.0,
  },
  {
    quote:
      "If I could give him 100 starts I would. This seller is prompt, and very professional. Very creative and imaginary. He is perfect as perfect can be. Will keep him in my favorite contacts for sure.",
    name: "sjames23",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/77d71593633bbf1f962e2da3ba65c897-1750637178838/442462ac-c7ec-4dda-a909-326de7f5dec5.jpg",
    rating: 5.0,
  },
  {
    quote:
      "I really appreciated the open lines of communication, and his desire to answer all of my questions and requests in designing my website. Quick response, great design ideas, willingness to explain made this a very satisfactory experience.",
    name: "peggybeane",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/505d8931ca9e04a24d3b90ee5dddd068-1612242112205/ef2845d7-4d2e-4974-8a44-6f773c2b4bbd.jpeg",
    rating: 5.0,
  },
  {
    quote:
      "Would definitely work with designfactory10 again. They saved me a ton of work in designing my website, had excellent communication about the project, and worked very quickly with prompt delivery - any delays were all on me! Thanks so much for your help!",
    name: "stephanieke",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Great business!",
    name: "sayan_ang",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/4df13a9686e1f72e3e69d10ffa8da739-1611682064394/47a9132e-3112-4e53-9abb-0d03d85c7ef8.jpg",
    rating: 5.0,
  },
  {
    quote:
      "Working with designfactory10 was amazing. Great communication and walked me through the process with no issues. Will definitely support again.",
    name: "tarnishacarter",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Amazing! Highly recommend! He understood my project details, really cared, and executed them perfectly! Fast communication and resourcefulness!",
    name: "orule_okorie",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Good value Website. I just wanted a functional website and for the price I was very satisfied.",
    name: "mari7799",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "website made to perfection",
    name: "daphneeabelard",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/d5a4c30da736e27086b1abedd9909239-926224661615338355.386598/6ADF78B4-0D4B-4254-9684-4AE7F75416B2",
    rating: 5.0,
  },
  {
    quote:
      "Designfactory10 was easy to communicate and understood my project properly. Very responsive with the communication and very creative with the webpage design. Will be using again for my future requirements and highly recommended.",
    name: "lagathg",
    country: "United Kingdom",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1ec-1f1e7.png",
    flagAlt: "GB",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Very efficient and quick response.",
    name: "glhenderson",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "simply great!!. He is the best, everything is up to the highest standers... hope to do future work with him. Thanks!!",
    name: "charithasanoj",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Thank You Thiraj!! Wonderful job! He is fluent and precise in communication, delivered very fast and did a beautiful design!. 100% in every aspect! Will definitely hire Him again.",
    name: "charithasanoj",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote: "Will definitely work with again.",
    name: "datasushi",
    country: "Switzerland",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1ed.png",
    flagAlt: "CH",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/dae39af37d207bc0b128bb05dd70922f-1679091089585/fb9a0ec3-3eb8-4a5d-b13c-3703a4eb5ee0.jpg",
    rating: 5.0,
  },
  {
    quote: "Perfect job, fast, uncomplicated and accurate.",
    name: "datasushi",
    country: "Switzerland",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e8-1f1ed.png",
    flagAlt: "CH",
    avatar:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/dae39af37d207bc0b128bb05dd70922f-1679091089585/fb9a0ec3-3eb8-4a5d-b13c-3703a4eb5ee0.jpg",
    rating: 5.0,
  },
  {
    quote:
      "I loved working with this seller! He under bid all his competitors and delivered a much more superior product. He bid so low I decided to go with someone else who charged me double the amount...but under delivered. That didnt go well, so I contacted him again and accepted his bid. He went way...",
    name: "user26312103",
    country: "United States",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png",
    flagAlt: "US",
    avatar: null,
    rating: 5.0,
  },
  {
    quote:
      "Thank you for your help with migrating my site from WP to HubSpot. Very helpful, and worked through a number of challenges on my side to still deliver, great communication, delivered within 24 hours and the job was well done. Highly recommend.",
    name: "amiriamack",
    country: "Australia",
    flag: "https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e6-1f1fa.png",
    flagAlt: "AU",
    avatar: null,
    rating: 5.0,
  },
];

type Testimonial = {
  quote: string;
  name: string;
  country: string | null;
  avatar: string | null;
  rating: number;
};

const PAGE_SIZE = 9;

export default function Testimonials() {
  const [dbReviews, setDbReviews] = useState<Testimonial[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("reviews")
      .select("name, avatar_url, country, quote, rating, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || !data || cancelled) return;
        setDbReviews(
          data.map((r) => ({
            quote: r.quote,
            name: r.name,
            country: r.country,
            avatar: r.avatar_url,
            rating: r.rating,
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allTestimonials = [...dbReviews, ...testimonials];
  const avgRating =
    allTestimonials.reduce((sum, t) => sum + t.rating, 0) /
    allTestimonials.length;

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-16 bg-ink py-24 text-cream lg:scroll-mt-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-64 hidden w-64 bg-ink lg:block"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            tone="dark"
            eyebrow="Testimonials"
            title="From People I've Worked With"
          />
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] px-5 py-3">
            <svg
              viewBox="0 0 20 20"
              className="h-6 w-6 text-yellow"
              fill="currentColor"
            >
              <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
            </svg>
            <div>
              <div className="font-display text-2xl font-bold text-yellow">
                {avgRating.toFixed(1)}
              </div>
              <div className="text-xs text-cream/50">
                from {allTestimonials.length} reviews
              </div>
            </div>
          </div>
        </div>

        <Reveal delay={80}>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTestimonials.slice(0, visibleCount).map((t, i) => {
              const flag = countryFlag(t.country);
              return (
                <motion.figure
                  key={`${t.name}-${i}`}
                  whileHover={{ y: -4 }}
                  transition={springy}
                  className="flex flex-col rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] p-6"
                >
                  <Stars rating={t.rating} />
                  <blockquote className="mt-4 line-clamp-5 flex-1 text-sm leading-relaxed text-cream/60">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Avatar name={t.name} avatar={t.avatar} />
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="flex items-center gap-1.5 text-sm text-cream/50">
                        {flag && (
                          <span className="text-[18px] leading-none">
                            {flag}
                          </span>
                        )}
                        <span>
                          Verified Client{t.country ? `, ${t.country}` : ""}
                        </span>
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </Reveal>

        {visibleCount < allTestimonials.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(c + PAGE_SIZE, allTestimonials.length),
                )
              }
              className="rounded-full border border-dashed border-border-on-black px-6 py-2.5 text-sm font-medium text-cream/70 transition hover:border-yellow hover:text-yellow"
            >
              Show more reviews ({visibleCount} of {allTestimonials.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
