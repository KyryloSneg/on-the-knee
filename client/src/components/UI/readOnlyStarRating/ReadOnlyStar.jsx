const Star = ({ starIndex, value, width, height, starKey, ...props }) => {
  // indexes for 5-star rating: 1,2,3,4,5
  const gradId = `${starKey}-grad`.trim().split(" ").join("");  
  let yellowFillPercent;

  // value with no rounding
  const intValue = +(`${value}`.split(".")[0]);
  if (starIndex <= intValue) {
    yellowFillPercent = 100;
  } else if (starIndex - value > 0 && starIndex - value < 1) { // 
    yellowFillPercent = Math.abs(1 - (starIndex - value)).toFixed(1) * 100; // rounding to tenths
  } else {
    yellowFillPercent = 0;
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={width} height={height}
      viewBox="0 0 32 32"
      key={starKey}
      {...props}
    >
      <defs>
        <linearGradient id={gradId}>
          <stop offset={`${0}%`} stopColor="#F3F800" stroke="#FFE600" stopOpacity={1} />
          <stop offset={`${yellowFillPercent}%`} stopColor="#F3F800" stroke="#FFE600" stopOpacity={1} />
          <stop offset={`${yellowFillPercent}%`} stopColor="#D0D0D0" stopOpacity={1} />
          <stop offset={`${100}%`} stopColor="#D0D0D0" stopOpacity={1} />
        </linearGradient>
      </defs>
      <path 
        fill={`url(#${gradId})`} stroke="#FFE600" 
        d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
           l11.547-1.2L16.026,0.6L20.388,10.918z"
      />
    </svg>
  );
}

export default Star;
