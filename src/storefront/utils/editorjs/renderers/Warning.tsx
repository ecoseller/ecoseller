import styles from "@/styles/Editorjs/Renderers/Warning.module.scss";

const WarningRenderer = ({ data }: { data: any }) => {
  return (
    <div className={styles.warning_holder}>
      {data.title ? <span className={styles.title}>{data.title}</span> : null}{" "}
      {data.message}
    </div>
  );
};

export default WarningRenderer;
