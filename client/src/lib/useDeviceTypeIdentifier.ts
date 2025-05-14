import { useEffect, useState } from "react";

import { toggleDeviceType } from "./../store/deviceTypeSlice";
import { useAppDispatch } from "../store/useAppDispatch";

export const useDeviceTypeIdentifier = () => {
  const dispatch = useAppDispatch();
  const [isMobile, setMobile] = useState<boolean>(),
    [isTablet, setTablet] = useState<boolean>(),
    [isPhone, setPhone] = useState<boolean>();

  useEffect(() => {
    const clientWidth: number = window.innerWidth,
      mobileCondition: boolean = 1260.1 > clientWidth,
      tabletCondition: boolean = 1260.1 > clientWidth && 768 < clientWidth,
      phoneCondition: boolean = 768 > clientWidth;
    setMobile(mobileCondition);
    setTablet(tabletCondition);
    setPhone(phoneCondition);
    window.addEventListener("resize", () => {
      const resizeClientWidth = window.innerWidth,
        resizeMobileCondition: boolean = 1260.1 > resizeClientWidth,
        resizeTabletCondition: boolean =
          1260.1 > resizeClientWidth && 768.1 < resizeClientWidth,
        resizePhoneCondition: boolean = 768 > resizeClientWidth;
      setMobile(resizeMobileCondition);
      setTablet(resizeTabletCondition);
      setPhone(resizePhoneCondition);
    });
  }, []);
  useEffect(() => {
    dispatch(toggleDeviceType({ isMobile, isTablet, isPhone }));
  }, [dispatch, isMobile, isTablet, isPhone]);
};
