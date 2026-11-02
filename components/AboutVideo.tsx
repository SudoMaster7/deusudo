"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/lib/config";
import { Icon } from "./Icons";

const ALT = "Leonardo Brito, fundador da SUDO";
// A mesma imagem em duas larguras: a maior é usada no desktop, a menor no celular.
const SIZES = "(max-width: 900px) 360px, 340px";

function Photo() {
  return <Image src="/leo.jpg" alt={ALT} fill sizes={SIZES} quality={82} />;
}

// Foto em /public/leo.jpg. O vídeo se configura em lib/config.ts (youtubeId ou mp4).
export function AboutVideo() {
  const { youtubeId, mp4 } = site.video;
  const [playing, setPlaying] = useState(false);

  if (mp4) {
    return (
      <div className="video">
        <video src={mp4} poster="/leo.jpg" controls playsInline preload="none" />
      </div>
    );
  }

  if (youtubeId) {
    return (
      <div className="video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title="Vídeo de apresentação da SUDO"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Photo />
            <span className="cap">Conheça o Leo em 1 minuto</span>
            <button
              type="button"
              className="play"
              aria-label="Assistir ao vídeo de apresentação"
              onClick={() => setPlaying(true)}
            >
              <Icon name="play" />
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="video">
      <Photo />
    </div>
  );
}
