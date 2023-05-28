import styles from "@/styles/Editorjs/Renderers/Delimeter.module.scss";

const DelimiterRenderer = () => {
  return (
    <div className={styles.delimiter_holder}>
      <div className={styles.line} />
      <div className={`${styles.line} ${styles.primary_color}`} />
      <div className={styles.line} />
    </div>
  );
};

export default DelimiterRenderer;
