import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * TiltedCard - A 3D interactive card component.
 *
 * Props:
 *  - imageSrc: string (required) – Image URL displayed inside the card.
 *  - altText: string – Alt text for the image.
 *  - captionText: string – Optional caption displayed below the image.
 *  - containerHeight, containerWidth: string – CSS height/width of the outer container.
 *  - imageHeight, imageWidth: string – CSS height/width of the image element.
 *  - rotateAmplitude: number – Maximum rotation in degrees for tilt effect.
 *  - scaleOnHover: number – Scale factor when hovered.
 *  - showMobileWarning: bool – Show a small message on mobile devices.
 *  - showTooltip: bool – Show tooltip on hover.
 *  - displayOverlayContent: bool – Render overlayContent over the image.
 *  - overlayContent: ReactNode – Content to overlay on the image.
 */
export default function TiltedCard({
  imageSrc,
  altText = 'Tilted Card Image',
  captionText,
  containerHeight = '300px',
  containerWidth = '300px',
  imageHeight = '100%',
  imageWidth = '100%',
  rotateAmplitude = 12,
  scaleOnHover = 1.2,
  showMobileWarning = false,
  showTooltip = false,
  displayOverlayContent = false,
  overlayContent = null,
}) {
  // Motion values for mouse position normalized to -0.5..0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30 });
  const springY = useSpring(y, { stiffness: 200, damping: 30 });

  // Convert to rotation degrees based on rotateAmplitude prop
  const rotateX = useTransform(
    springY,
    [-0.5, 0.5],
    [`${rotateAmplitude}deg`, `-${rotateAmplitude}deg`]
  );
  const rotateY = useTransform(
    springX,
    [-0.5, 0.5],
    [`-${rotateAmplitude}deg`, `${rotateAmplitude}deg`]
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Normalise to -0.5 .. 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Detect mobile devices (simple width check)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div
      className="relative"
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: 800,   // perspective must live on the PARENT, not the rotating child
      }}
    >
      {showMobileWarning && isMobile && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm z-10">
          TiltedCard interactive effect is disabled on mobile.
        </div>
      )}
      <motion.div
        className="relative h-full w-full rounded-xl overflow-hidden shadow-xl cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: scaleOnHover }}
        initial={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="object-cover h-full w-full"
          style={{ height: imageHeight, width: imageWidth }}
        />
        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            {overlayContent}
          </div>
        )}
      </motion.div>
      {showTooltip && captionText && (
        <div className="mt-2 text-center text-sm text-gray-200">
          {captionText}
        </div>
      )}
    </div>
  );
}

TiltedCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string,
  captionText: PropTypes.string,
  containerHeight: PropTypes.string,
  containerWidth: PropTypes.string,
  imageHeight: PropTypes.string,
  imageWidth: PropTypes.string,
  rotateAmplitude: PropTypes.number,
  scaleOnHover: PropTypes.number,
  showMobileWarning: PropTypes.bool,
  showTooltip: PropTypes.bool,
  displayOverlayContent: PropTypes.bool,
  overlayContent: PropTypes.node,
};
