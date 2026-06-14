"use client";

import { useEffect } from "react";
import gsap from "gsap";

const splitTextIntoChars = (element: HTMLElement) => {
  const text = element.textContent || "";
  element.innerHTML = "";
  const chars: HTMLElement[] = [];

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.classList.add("letter");
    span.textContent = text[i];
    span.style.display = "inline-block";
    element.appendChild(span);
    chars.push(span);
  }

  return chars;
};

const TEAM_MEMBERS = [
  "Anelka",
  "Djodev",
  "Greg",
  "Yves",
  "Pelagie",
  "HK",
  "Promesse",
  "Lucien",
  "Big Man"
];

const getAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

const getBreakpoint = () => {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 480) return "mobile-sm";
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const getAnimationConfig = (breakpoint: string) => {
  const configs: Record<string, { imgBase: number; imgHover: number; duration: number }> = {
    "mobile-sm": { imgBase: 50, imgHover: 80, duration: 0.3 },
    "mobile": { imgBase: 55, imgHover: 90, duration: 0.3 },
    "tablet": { imgBase: 65, imgHover: 120, duration: 0.35 },
    "desktop": { imgBase: 70, imgHover: 140, duration: 0.35 },
  };
  return configs[breakpoint] || configs.desktop;
};

const TeamSection = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const breakpoint = getBreakpoint();
    const config = getAnimationConfig(breakpoint);

    const profileImages = document.querySelectorAll(".profile-images .img");
    const nameElements = document.querySelectorAll(".profile-names .name");
    const nameHeadings = document.querySelectorAll(".profile-names .name h1");

    nameHeadings.forEach((heading) => {
      splitTextIntoChars(heading as HTMLElement);
    });

    const defaultName = document.querySelector(".name.default");
    const defaultLetters = defaultName ? defaultName.querySelectorAll(".letter") : [];

    if (defaultLetters.length) {
      gsap.set(defaultLetters, { y: "0%" });
    }

    // Animations seulement pour tablet et desktop
    if (breakpoint === "tablet" || breakpoint === "desktop") {
      profileImages.forEach((img, index) => {
        const correspondingName = nameElements[index + 1];
        if (!correspondingName) return;
        const letters = correspondingName.querySelectorAll(".letter");
        gsap.set(letters, { y: "100%" });

        img.addEventListener("mouseenter", () => {
          gsap.to(img, {
            width: config.imgHover,
            height: config.imgHover,
            duration: config.duration,
            ease: "power4.out"
          });
          gsap.to(letters, {
            y: "-100%",
            duration: 0.8,
            ease: "power4.out",
            stagger: { each: 0.03, from: "center" },
          });
          if (defaultLetters.length) {
            gsap.to(defaultLetters, {
              y: "-150%",
              duration: 0.8,
              ease: "power4.out",
              stagger: { each: 0.03, from: "center" },
            });
          }
        });

        img.addEventListener("mouseleave", () => {
          gsap.to(img, {
            width: config.imgBase,
            height: config.imgBase,
            duration: config.duration,
            ease: "power4.out"
          });
          gsap.to(letters, {
            y: "100%",
            duration: 0.8,
            ease: "power4.out",
            stagger: { each: 0.03, from: "center" },
          });
          if (defaultLetters.length) {
            gsap.to(defaultLetters, {
              y: "0%",
              duration: 0.8,
              ease: "power4.out",
              stagger: { each: 0.03, from: "center" },
            });
          }
        });
      });
    }

    // Gestion du redimensionnement
    const handleResize = () => {
      const newBreakpoint = getBreakpoint();
      if (newBreakpoint !== breakpoint) {
        window.location.reload();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        .team {
          position: relative;
          width: 100vw;
          height: 100svh;
          background-color: #f8eed4;
          color: #1f1f1e;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1.5em;
          overflow: hidden;
          padding: 1rem;
        }
        
        .profile-images {
          width: 100%;
          max-width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .img {
          position: relative;
          width: 50px;
          height: 50px;
          padding: 3px;
          cursor: pointer;
          will-change: width, height;
          flex-shrink: 0;
        }
        
        .img img {
          border-radius: 0.5rem;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-names {
          width: 100%;
          height: 6rem;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          overflow: hidden;
          position: relative;
        }
        
        .name h1 {
          position: absolute;
          width: 100%;
          text-align: center;
          text-transform: uppercase;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1;
          color: #f93535;
          user-select: none;
          transform: translateY(100%);
          margin: 0;
          padding: 0;
        }
        
        .name.default h1 {
          transform: translateY(0);
          color: #111111;
        }
        
        .name h1 .letter {
          position: relative;
          transform: translateY(0%);
          will-change: transform;
        }
        
        /* MOBILE SMALL (< 480px) */
        @media (max-width: 479px) {
          .team {
            gap: 1em;
            padding: 0.75rem;
          }
          
          .profile-images {
            gap: 0.4rem;
          }
          
          .img {
            width: 50px;
            height: 50px;
            padding: 2px;
          }
          
          .profile-names {
            height: 5rem;
          }
          
          .name h1 {
            font-size: 1.5rem;
            letter-spacing: 0;
          }
        }
        
        /* MOBILE (480px - 767px) */
        @media (min-width: 480px) and (max-width: 767px) {
          .team {
            gap: 1.2em;
            padding: 1rem;
          }
          
          .profile-images {
            gap: 0.5rem;
          }
          
          .img {
            width: 55px;
            height: 55px;
            padding: 3px;
          }
          
          .profile-names {
            height: 6rem;
          }
          
          .name h1 {
            font-size: 2rem;
            letter-spacing: -0.1rem;
          }
        }
        
        /* TABLET (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .team {
            gap: 2em;
            padding: 1.5rem;
          }
          
          .profile-images {
            gap: 0.75rem;
            flex-wrap: nowrap;
          }
          
          .img {
            width: 65px;
            height: 65px;
            padding: 4px;
          }
          
          .profile-names {
            height: 10rem;
          }
          
          .name h1 {
            font-size: 8rem;
            letter-spacing: -0.3rem;
          }
        }
        
        /* DESKTOP (>= 1024px) */
        @media (min-width: 1024px) {
          .team {
            gap: 2.5em;
            padding: 2rem;
          }
          
          .profile-images {
            gap: 0.75rem;
            flex-wrap: nowrap;
            width: max-content;
          }
          
          .img {
            width: 70px;
            height: 70px;
            padding: 5px;
          }
          
          .profile-names {
            height: 20rem;
          }
          
          .name h1 {
            font-size: 20rem;
            letter-spacing: -0.5rem;
          }
        }
        
        /* Support pour écrans très larges */
        @media (min-width: 1920px) {
          .team {
            gap: 3em;
          }
          
          .img {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>

        <section className="team">
          <div className="profile-images">
            {TEAM_MEMBERS.map((member) => (
                <div key={member} className="img">
                  <img
                      src={getAvatarUrl(member)}
                      alt={member}
                      loading="lazy"
                  />
                </div>
            ))}
          </div>

          <div className="profile-names">
            <div className="name default"><h1>Bag\Ui</h1></div>
            {TEAM_MEMBERS.map((member) => (
                <div key={member} className="name">
                  <h1>{member}</h1>
                </div>
            ))}
          </div>
        </section>
      </>
  );
};

export default TeamSection;