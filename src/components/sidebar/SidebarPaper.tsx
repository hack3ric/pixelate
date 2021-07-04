import { createStyles, ListItemText, makeStyles, Paper } from "@material-ui/core";
import { useSidebarStyles } from "./common";

export interface SidebarPaperProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SidebarPaper({ children, style }: SidebarPaperProps) {
  const styles = useSidebarStyles();

  return (
    <Paper
      variant="outlined"
      className={styles.paper}
      style={style}
    >
      {children}
    </Paper>
  );
}
