import React from "react";
import { Skeleton } from "antd";
import Link from "next/link";

const FeaturedCard = ({ img }) => {
  return (
    <Link href={`/`}>
      <div className="rounded-md flex cursor-pointer items-center justify-center ">
        <div className="w-60">
          {img ? (
            <img className="rounded-md" src={`/images/Featured/${img}`} alt="FeaturedCard" />
          ) : (
            <Skeleton.Image active={true} className="w-60 h-60" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
