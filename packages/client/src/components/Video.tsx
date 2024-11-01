
export const Video = ({ src }: { src: string }) => {
  return (
    <video width="1920" height="1080" controls={false} autoPlay loop muted className="w-full h-full">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
