import { useTranslation } from "next-i18next";
import Dialog from "@mui/material/Dialog";
import { useState, useReducer, useEffect } from "react";
import Image from "next/image";
import Fade from "@mui/material/Fade";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCookie } from "@/utils/context/cookies";
import styles from "@/styles/Common/CookieDisclaimer.module.scss";
import Button from "@mui/material/Button";

interface ICookieDisclaimer {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CookieDisclaimer = ({ open, setOpen }: ICookieDisclaimer) => {
  const { t } = useTranslation("cookie");

  const [openDiscount, setOpenDiscount] = useState<boolean>(false);

  const [isAdvancedContent, setAdvancedContent] = useState<boolean>(false);
  const aggreeAllSettings = () => {
    setCookieState("PREFERENCE", true);
    setCookieState("STATISTICAL", true);
    setCookieState("ADS", true);
    setCookieSettingToCookies(true);
    setOpen(false);
  };

  const saveSelectedSettings = () => {
    setCookieSettingToCookies();
    setOpen(false);
  };

  const { cookieState, setCookieState, setCookieSettingToCookies } =
    useCookie();

  useEffect(() => {
    if (cookieState) {
      setOpen(cookieState.openDisclaimer);
    }
  }, [cookieState.openDisclaimer]);

  const isSmaller = useMediaQuery("(max-width:700px)");
  const isMobile = useMediaQuery("(max-width:520px)");

  const resolveState = (
    state: boolean | undefined,
    click: boolean
  ): boolean => {
    if (state === undefined && click) {
      return false;
    }
    if (state === undefined) {
      return true;
    }
    if ((state === true || state === false) && click === true) {
      return !state;
    }
    return state;
  };

  return (
    <>
      <Dialog
        fullWidth
        PaperProps={{
          style: {
            boxShadow: "none",
            width: "100%",
            maxWidth: "765px",
            minHeight: isSmaller ? "350px" : "506px",
            position: "relative",
            overflow: !isAdvancedContent ? "visible" : "auto",
            backgroundColor: "transparent",
            marginTop: isMobile ? "auto" : isAdvancedContent ? "0px" : "-56px",
            marginLeft: isAdvancedContent ? "0px" : "-44px",
            marginRight: isAdvancedContent ? "0px" : "44px",
            marginBottom: 0,
          },
        }}
        open={open}
        disableEscapeKeyDown={true}
      >
        <div
          className={`${styles.cookiesDisclaimer_holder} ${
            isAdvancedContent ? styles.noMargin : ""
          }`}
          data-nosnippet="data-nosnippet"
        >
          {!isAdvancedContent ? (
            <>
              <div className={styles.content_holder}>
                <p className={styles.heading}>
                  {t("main-title") /* Cookies */}
                </p>
                <p className={styles.description}>
                  {
                    t(
                      "main-description"
                    ) /* We use cookies to improve your experience on our website. */
                  }
                </p>
                <div className={styles.controls_holder}>
                  <p
                    className={styles.change_settings_button}
                    onClick={() => setAdvancedContent(true)}
                  >
                    {t("change-settings") /* Change settings */}
                  </p>
                  <Button
                    variant={"contained"}
                    onClick={() => aggreeAllSettings()}
                  >
                    {t("agree-all") /* Agree all */}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Fade in={isAdvancedContent}>
              <div
                className={`${styles.content_holder} ${styles.settings_content_holder}`}
              >
                <p className={styles.heading}>
                  {t("custom-settings-title") /* Custom settings */}
                </p>
                <p className={styles.description}>
                  {
                    t(
                      "custom-settings-description"
                    ) /* You can customize your cookie preferences by selecting the
                  appropriate categories below. */
                  }
                </p>
                <div className={styles.settings_items_holder}>
                  <SettingsItem
                    isMandatory={true}
                    state={cookieState.neccessaryCookies}
                    setState={() => {}}
                    title={t("mandatory-title") /**Mandatory*/}
                    description={
                      t("mandatory-description")
                      /*Mandatory cookies are required for the website to function properly.*/
                    }
                  />
                  <SettingsItem
                    isMandatory={false}
                    state={resolveState(cookieState.preferenceCookies, false)}
                    setState={() => {
                      setCookieState(
                        "PREFERENCE",
                        resolveState(cookieState.preferenceCookies, true)
                      );
                    }}
                    title={t("preference-title") /**Preference*/}
                    description={
                      t("preference-description")
                      /*Preference cookies enable a website to remember information that changes the way the website behaves or looks, like products that you visited, etc.*/
                    }
                  />
                  <SettingsItem
                    isMandatory={false}
                    state={resolveState(cookieState.statisticalCookies, false)}
                    setState={() => {
                      setCookieState(
                        "STATISTICAL",
                        resolveState(cookieState.statisticalCookies, true)
                      );
                    }}
                    title={t("statistical-title") /**Statistical*/}
                    description={
                      t("statistical-description")
                      /*Statistical cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.*/
                    }
                  />
                  <SettingsItem
                    isMandatory={false}
                    state={resolveState(cookieState.adsCookies, false)}
                    setState={() => {
                      setCookieState(
                        "ADS",
                        resolveState(cookieState.adsCookies, true)
                      );
                    }}
                    title={t("ads-title") /**Ads*/}
                    description={
                      t("ads-description")
                      /*Ads cookies are used to show you remarketing ads. It doesn't track you in any way and doesn't mean that you will not see any ads. They are just more relevant to you.*/
                    }
                  />
                </div>

                <div className={styles.controls_holder}>
                  <Button
                    variant={"outlined"}
                    onClick={() => saveSelectedSettings()}
                  >
                    {t("save-settings") /* Save settings */}
                  </Button>
                  <div className={`${styles.button_fixed_holder}`}>
                    <Button
                      variant={"contained"}
                      onClick={() => aggreeAllSettings()}
                    >
                      {t("agree-all") /* Agree all */}
                    </Button>
                  </div>
                </div>
              </div>
            </Fade>
          )}
        </div>
      </Dialog>
    </>
  );
};

interface ISettingsItem {
  isMandatory?: boolean;
  state: boolean;
  setState: () => void;
  title: string;
  description: string;
}

const SettingsItem = ({
  isMandatory,
  state,
  setState,
  title,
  description,
}: ISettingsItem) => {
  return (
    <div className={styles.settings_item}>
      <div className={styles.settings_switch_wrapper}>
        <div
          className={`${styles.settings_switch} ${
            isMandatory ? styles.state_on + " " + styles.state_disabled : ""
          } ${state ? styles.state_on : styles.state_off}`}
          onClick={
            !isMandatory
              ? setState
              : () => {
                  console.log("state cannot be changed");
                }
          }
        >
          <div className={styles.toggler}></div>
        </div>
      </div>
      <div className={styles.settings_content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default CookieDisclaimer;
