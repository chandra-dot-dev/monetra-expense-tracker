// Monetra Premium Design System Tokens (Old Money + Modern Luxury Fintech Aesthetic)

export const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(" ");

export const dashboardStyles = {
  container: "min-h-screen p-4 md:p-8 bg-bg-app text-text-app transition-colors duration-200",
  
  headerContainer: "bg-surface-app rounded-2xl p-6 md:p-8 mb-6 border border-border-app shadow-xs",
  headerContent: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4",
  headerTitle: "text-2xl md:text-3xl font-serif font-bold tracking-tight text-text-app",
  headerSubtitle: "text-muted-app text-xs mt-1 font-sans",
  
  addButton: "flex items-center gap-2 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold cursor-pointer shadow-xs active:scale-[0.98]",
  
  timeFrameContainer: "flex justify-end border-t border-border-app pt-4",
  timeFrameWrapper: "flex bg-bg-app p-1 rounded-xl border border-border-app",
  timeFrameButton: (isActive: boolean) => 
    `px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer ${
      isActive 
        ? "bg-surface-app text-text-app border border-border-app shadow-2xs font-semibold" 
        : "text-muted-app hover:text-text-app border border-transparent"
    }`,
  
  summaryGrid: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6",
  balanceBadge: "bg-surface-app text-text-app px-2.5 py-1 rounded-md text-[10px] font-medium border border-border-app tracking-wide",
  expenseBadge: "bg-surface-app text-text-app px-2.5 py-1 rounded-md text-[10px] font-medium border border-border-app tracking-wide",
  
  gaugeGrid: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6",
  
  pieChartContainer: "bg-surface-app rounded-2xl p-6 border border-border-app mb-6 shadow-xs",
  pieChartHeader: "flex justify-between items-center mb-4",
  pieChartTitle: "text-base font-serif font-semibold text-text-app flex items-center gap-2",
  pieChartSubtitle: "text-xs font-normal text-muted-app ml-1",
  pieChartHeight: "h-64",
  
  tooltipContent: {
    backgroundColor: "var(--color-surface-hex)",
    border: "1px solid var(--color-border-hex)",
    borderRadius: "0.75rem", // rounded-xl
    padding: "8px 12px",
    color: "var(--color-text-hex)",
    fontSize: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    fontFamily: "var(--font-sans)"
  },
  tooltipItem: { fontWeight: 600, fontSize: "12px" },
  
  legendWrapper: { paddingTop: 8 },
  legendText: "text-[11px] font-medium text-muted-app tracking-wider",
  
  listsGrid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  
  listContainer: "bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs",
  listHeader: "flex justify-between items-center mb-4 border-b border-border-app pb-3",
  listTitle: "text-base font-serif font-semibold text-text-app flex items-center gap-2",
  listSubtitle: "text-xs text-muted-app font-normal block mt-0.5 font-sans",
  
  incomeCountBadge: "text-[10px] font-semibold bg-bg-app text-text-app px-2.5 py-0.5 rounded-full border border-border-app",
  expenseCountBadge: "text-[10px] font-semibold bg-bg-app text-text-app px-2.5 py-0.5 rounded-full border border-border-app",
  
  transactionList: "space-y-2.5",
  incomeTransactionItem: "flex items-center justify-between p-3.5 bg-bg-app hover:bg-surface-app/40 rounded-xl border border-border-app transition-all duration-150 shadow-2xs",
  expenseTransactionItem: "flex items-center justify-between p-3.5 bg-bg-app hover:bg-surface-app/40 rounded-xl border border-border-app transition-all duration-150 shadow-2xs",
  
  incomeIconContainer: "p-2 bg-surface-app text-[var(--color-gold-hex)] rounded-lg border border-border-app",
  expenseIconContainer: "p-2 bg-surface-app text-[var(--color-gold-hex)] rounded-lg border border-border-app",
  
  transactionContent: "flex items-center gap-3.5 min-w-0",
  transactionDescription: "font-medium text-text-app text-xs truncate",
  transactionCategory: "text-[10px] text-muted-app mt-0.5 font-sans tracking-wide",
  transactionAmount: "text-right flex-shrink-0 font-sans",
  incomeAmount: "font-semibold text-[#5E7A68] text-xs",
  expenseAmount: "font-semibold text-[#9B5B57] text-xs",
  transactionDate: "text-[9px] text-muted-app mt-0.5 tracking-wide",
  
  emptyState: "text-center py-10",
  emptyIconContainer: (color: string) => `w-12 h-12 mx-auto mb-3 rounded-full bg-surface-app flex items-center justify-center border border-border-app text-[var(--color-gold-hex)]`,
  emptyText: "text-muted-app font-semibold text-xs font-serif",
  
  viewAllContainer: "pt-4 border-t border-border-app mt-3",
  viewAllButton: "w-full flex items-center justify-center gap-1.5 py-2.5 text-muted-app hover:text-text-app text-[11px] font-semibold hover:bg-bg-app rounded-xl transition-all cursor-pointer border border-border-app tracking-wide",
  
  iconContainer: (color: string) => `p-2 bg-surface-app border border-border-app rounded-lg text-[var(--color-gold-hex)]`,
  
  walletIconContainer: "p-2 bg-surface-app border border-border-app rounded-lg text-[var(--color-gold-hex)]",
  arrowDownIconContainer: "p-2 bg-surface-app border border-border-app rounded-lg text-[var(--color-gold-hex)]",
  piggyBankIconContainer: "p-2 bg-surface-app border border-border-app rounded-lg text-[var(--color-gold-hex)]",
};

export const trendStyles = {
  positive: "text-[#5E7A68] font-semibold text-[11px]",
  negative: "text-[#9B5B57] font-semibold text-[11px]",
  positiveRate: "bg-surface-app text-[#5E7A68] px-2 py-0.5 rounded border border-border-app text-[9px] font-semibold",
  negativeRate: "bg-surface-app text-[#9B5B57] px-2 py-0.5 rounded border border-border-app text-[9px] font-semibold",
};

export const chartStyles = {
  pieChart: "text-[11px] font-sans font-medium",
};

export const incomeStyles = {
  wrapper: "space-y-6 max-w-7xl mx-auto p-4 md:p-8 text-text-app",
  headerContainer: "bg-surface-app rounded-2xl p-6 border border-border-app mb-4 shadow-xs",
  header: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3",
  headerTitle: "text-2xl font-serif font-bold tracking-tight text-text-app",
  headerSubtitle: "text-muted-app text-xs mt-1",
  addButton: "flex items-center gap-2 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold cursor-pointer shadow-xs active:scale-[0.98]",
  
  summaryGrid: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-4",
  
  chartContainer: "bg-surface-app rounded-2xl p-6 border border-border-app mb-4 shadow-xs",
  chartTitle: "text-base font-serif font-semibold text-text-app flex items-center gap-2",
  
  listContainer: "bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs",
  sectionTitle: "text-base font-serif font-semibold text-text-app flex items-center gap-2",
  
  filterContainer: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto",
  filterSelect: "appearance-none bg-bg-app border border-border-app rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] text-text-app cursor-pointer min-w-[130px] font-sans font-medium",
  exportButton: "flex items-center justify-center gap-1.5 bg-bg-app border border-border-app hover:bg-surface-app text-text-app px-4 py-2 rounded-xl transition-all text-xs font-semibold shadow-2xs cursor-pointer",
  
  transactionList: "space-y-2.5 mt-4",
  viewAllButton: "w-full flex items-center justify-center gap-1.5 py-3 text-muted-app hover:text-text-app text-[11px] font-semibold rounded-xl transition-all cursor-pointer border border-dashed border-border-app mt-2",
  
  emptyStateContainer: "text-center py-10",
  emptyStateIcon: "w-12 h-12 mx-auto mb-3 rounded-full bg-surface-app flex items-center justify-center border border-border-app text-[var(--color-gold-hex)]",
  emptyStateText: "text-muted-app font-semibold text-xs font-serif",
  emptyStateSubtext: "text-[10px] text-muted-app mt-1 font-sans",
  emptyStateButton: "mt-4 flex items-center gap-2 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2 rounded-xl transition-all text-xs font-semibold cursor-pointer shadow-xs mx-auto",
  
  timeFrameContainer: "flex justify-end pt-1",
  chartHeaderContainer: "flex justify-between items-center mb-4",
  chartHeight: "h-64",
  
  tooltipContent: {
    backgroundColor: "var(--color-surface-hex)",
    border: "1px solid var(--color-border-hex)",
    borderRadius: "0.75rem",
    padding: "8px 12px",
    color: "var(--color-text-hex)",
    fontSize: "12px",
    fontFamily: "var(--font-sans)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
  },
  
  iconGreen: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
  iconBlue: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
  iconPurple: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
  
  textGreen: "text-text-app",
  textBlue: "text-text-app",
  textPurple: "text-text-app",
  
  filterIcon: "absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-app pointer-events-none",
  
  borderGreen: "border-l border-border-app",
  borderBlue: "border-l border-border-app",
  borderPurple: "border-l border-border-app",
};

export const expensePageStyles = {
  container: "space-y-6 max-w-7xl mx-auto p-4 md:p-8 text-text-app",
  
  headerCard: "bg-surface-app rounded-2xl p-6 border border-border-app mb-4 shadow-xs",
  headerContainer: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3",
  headerTitle: "text-2xl font-serif font-bold tracking-tight text-text-app",
  headerSubtitle: "text-muted-app text-xs mt-1",
  addButton: "flex items-center gap-2 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold cursor-pointer shadow-xs active:scale-[0.98]",
  
  cardsGrid: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-4",
  
  chartContainer: "bg-surface-app rounded-2xl p-6 border border-border-app mb-4 shadow-xs",
  chartHeader: "flex justify-between items-center mb-4",
  chartTitle: "text-base font-serif font-semibold text-text-app flex items-center gap-2",
  exportButton: "flex items-center gap-1.5 bg-bg-app border border-border-app hover:bg-surface-app text-text-app px-4 py-2 rounded-xl transition-all text-xs font-semibold shadow-2xs cursor-pointer",
  chart: "h-64",
  
  transactionsContainer: "bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs",
  transactionsHeader: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b border-border-app pb-3",
  transactionsTitle: "text-base font-serif font-semibold text-text-app flex items-center gap-2",
  filterSelect: "appearance-none bg-bg-app border border-border-app rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] text-text-app cursor-pointer min-w-[130px] font-sans font-medium",
  
  transactionsList: "space-y-2.5",
  viewAllButton: "w-full flex items-center justify-center gap-1.5 py-3 text-muted-app hover:text-text-app text-[11px] font-semibold rounded-xl transition-all cursor-pointer border border-dashed border-border-app mt-2",
  emptyState: "text-center py-10",
  emptyStateIcon: "w-12 h-12 mx-auto mb-3 rounded-full bg-surface-app flex items-center justify-center border border-border-app text-[var(--color-gold-hex)]",
  emptyStateText: "text-muted-app font-semibold text-xs font-serif",
  
  iconOrange: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
  iconAmber: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
  iconYellow: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
  textOrange: "text-text-app",
  textAmber: "text-text-app",
  textYellow: "text-text-app",
  
  borderOrange: "border-l border-border-app",
  borderAmber: "border-l border-border-app",
  borderYellow: "border-l border-border-app",
  
  tooltipContent: {
    backgroundColor: "var(--color-surface-hex)",
    border: "1px solid var(--color-border-hex)",
    borderRadius: "0.75rem",
    padding: "8px 12px",
    color: "var(--color-text-hex)",
    fontSize: "12px",
    fontFamily: "var(--font-sans)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
  },
  
  chartHeight: "h-64",
  chartExportButton: "flex items-center gap-1.5 bg-bg-app border border-border-app hover:bg-surface-app text-text-app px-4 py-2 rounded-xl transition-all text-xs font-semibold shadow-2xs cursor-pointer",
  emptyStateSubtext: "text-[10px] text-muted-app mt-1 font-sans",
  timeframePositioning: "flex justify-end pt-1",
  transactionItemContainer: "flex items-center justify-between p-3.5 bg-bg-app hover:bg-surface-app/40 rounded-xl border border-border-app transition-all duration-150 cursor-pointer shadow-2xs",
  transactionAmount: "text-right flex-shrink-0 font-sans font-semibold text-xs",
  transactionIcon: "p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg",
};

export const profileStyles = {
  container: "max-w-4xl mx-auto py-8 px-4 text-text-app",
  mainContainer: "bg-surface-app rounded-2xl overflow-hidden border border-border-app shadow-xs",
  
  header: "bg-bg-app p-6 md:p-8 text-center border-b border-border-app",
  avatar: "w-18 h-18 mx-auto rounded-full bg-surface-app flex items-center justify-center mb-3 border border-border-app text-[var(--color-gold-hex)] text-lg font-bold font-serif shadow-2xs",
  userName: "text-2xl font-serif font-bold text-text-app",
  userEmail: "text-muted-app text-xs mt-1 font-sans",
  
  content: "p-6 md:p-8",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  
  card: "bg-bg-app border border-border-app rounded-xl p-6 shadow-2xs",
  cardTitle: "text-xs font-semibold pb-2 text-text-app border-b border-border-app flex items-center gap-2 uppercase tracking-widest font-sans",
  icon: "w-3.5 h-3.5 text-[var(--color-gold-hex)]",
  
  label: "text-[10px] text-muted-app font-semibold uppercase tracking-widest block mb-1.5 font-sans",
  input: "w-full px-4 py-2.5 bg-bg-app border border-border-app rounded-xl text-xs text-text-app focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] focus:outline-none transition-all duration-150",
  inputWithError: "w-full px-4 py-2.5 bg-bg-app border border-red-500 rounded-xl text-xs text-text-app focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-150",
  
  buttonPrimary: "flex-1 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] py-2.5 rounded-xl text-xs font-semibold transition-all text-center shadow-xs cursor-pointer",
  buttonSecondary: "flex-1 py-2.5 border border-border-app text-text-app rounded-xl text-xs font-semibold hover:bg-surface-app transition-colors text-center cursor-pointer",
  editButton: "text-[var(--color-gold-hex)] hover:underline font-semibold text-xs cursor-pointer",
  changeButton: "text-[var(--color-gold-hex)] hover:underline font-semibold text-xs cursor-pointer",
  
  securityItem: "flex items-center justify-between p-4 bg-bg-app rounded-xl border border-border-app shadow-2xs",
  securityText: "font-semibold text-[10px] text-muted-app uppercase tracking-widest font-sans",
  
  modalContent: "bg-surface-app rounded-2xl p-6 w-full max-w-sm border border-border-app shadow-xl",
  modalHeader: "flex justify-between items-center mb-4",
  modalTitle: "text-base font-serif font-bold text-text-app",
  
  passwordLabel: "block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5",
  passwordContainer: "relative",
  passwordToggle: "absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-app hover:text-text-app transition-colors",
  
  errorText: "mt-1.5 text-[10px] text-red-500 font-medium",
};

export const modalStyles = {
  overlay: "fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-3xs flex items-center justify-center p-4 z-50 transition-all duration-150",
  modalContainer: "bg-surface-app rounded-2xl p-6 max-w-sm w-full shadow-xl border border-border-app overflow-hidden relative",
  
  modalHeader: "flex justify-between items-center mb-4 pb-2 border-b border-border-app",
  modalTitle: "text-base font-serif font-bold text-text-app",
  closeButton: "text-muted-app hover:text-text-app cursor-pointer transition-colors",
  
  form: "space-y-4",
  label: "block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5",
  input: (ringColor: string) => `w-full border border-border-app bg-bg-app text-text-app rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:border-[var(--color-gold-hex)] focus:ring-[var(--color-gold-hex)] transition-all duration-150`,
  
  typeButtonContainer: "flex gap-2",
  typeButton: (isSelected: boolean, colorClass: string) => 
    `flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
      isSelected 
        ? `bg-[var(--color-gold-hex)] text-[#FAF9F6] dark:text-[#0F0F11]` 
        : 'bg-bg-app border border-border-app text-muted-app hover:bg-surface-app'
    }`,
  
  submitButton: (colorClass: string) => `w-full bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] py-2.5 rounded-xl text-xs font-semibold mt-4 shadow-xs cursor-pointer transition-all`,
  
  colorClasses: {
    teal: {
      button: "bg-[var(--color-gold-hex)]",
      ring: "focus:ring-[var(--color-gold-hex)]",
      typeButtonSelected: "bg-[var(--color-gold-hex)]",
    },
    orange: {
      button: "bg-[var(--color-gold-hex)]",
      ring: "focus:ring-[var(--color-gold-hex)]",
      typeButtonSelected: "bg-[var(--color-gold-hex)]",
    },
  },
};

export const loginStyles = {
  pageContainer: "min-h-screen flex items-center justify-center p-4 bg-bg-app transition-colors duration-200",
  
  cardContainer: "w-full max-w-sm bg-surface-app border border-border-app rounded-2xl shadow-sm overflow-hidden",
  
  header: "bg-bg-app p-6 text-center border-b border-border-app",
  avatar: "w-14 h-14 mx-auto rounded-xl bg-surface-app text-[var(--color-gold-hex)] flex items-center justify-center mb-3 border border-border-app shadow-2xs",
  headerTitle: "text-xl font-serif font-bold tracking-tight text-text-app",
  headerSubtitle: "text-muted-app text-xs mt-1 font-sans",
  
  formContainer: "p-6",
  
  errorContainer: "mb-4 p-3 bg-red-500/10 text-red-500 rounded-xl flex items-center border border-red-500/20 text-xs font-medium",
  errorIcon: "mr-2 flex-shrink-0 text-red-500",
  errorText: "break-words",
  
  label: "block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5",
  inputContainer: "relative",
  inputIcon: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-app",
  input: "w-full pl-10 pr-4 py-2.5 bg-bg-app border border-border-app text-text-app rounded-xl text-xs focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] focus:outline-none transition-all",
  passwordInput: "w-full pl-10 pr-10 py-2.5 bg-bg-app border border-border-app text-text-app rounded-xl text-xs focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] focus:outline-none transition-all",
  passwordToggle: "absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-app hover:text-text-app transition-colors",
  
  checkboxContainer: "mb-4 flex items-center",
  checkbox: "w-3.5 h-3.5 text-[var(--color-gold-hex)] border-border-app rounded focus:ring-[var(--color-gold-hex)] bg-bg-app cursor-pointer",
  checkboxLabel: "ml-2.5 block text-xs text-muted-app font-medium cursor-pointer font-sans",
  
  button: "w-full bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center cursor-pointer text-xs shadow-xs",
  buttonDisabled: "opacity-85 cursor-not-allowed",
  
  signUpContainer: "mt-5 text-center border-t border-border-app pt-4",
  signUpText: "text-xs text-muted-app font-sans",
  signUpLink: "font-semibold text-[var(--color-gold-hex)] hover:underline",
  
  spinner: "animate-spin -ml-1 mr-2 h-4 w-4 text-bg-app"
};

export const navbarStyles = {
  header: "sticky top-0 z-40 bg-surface-app border-b border-border-app text-text-app transition-colors duration-200 shadow-3xs",
  container: "flex items-center justify-between px-4 py-3 md:px-8 max-w-7xl mx-auto h-16",
  
  logoContainer: "flex items-center gap-3 cursor-pointer font-bold select-none",
  logoImage: "w-9 h-9 rounded-lg flex-shrink-0 bg-text-app p-0.5 flex items-center justify-center text-bg-app font-black text-xs shadow-2xs",
  
  logoText: "text-base text-text-app tracking-tight font-serif font-bold",
  
  userContainer: "relative",
  userButton: "flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-bg-app border border-transparent hover:border-border-app transition-all cursor-pointer",
  userAvatar: "w-6 h-6 flex items-center justify-center rounded-lg bg-text-app text-bg-app font-bold text-xs font-serif shadow-2xs",
  statusIndicator: "absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-surface-app",
  userTextContainer: "text-left hidden md:block",
  userName: "text-[11px] font-semibold text-text-app truncate max-w-[90px]",
  userEmail: "text-[9px] text-muted-app truncate max-w-[90px] mt-0.5",
  chevronIcon: (isOpen: boolean) => `w-3 h-3 text-muted-app transition-transform ${isOpen ? "rotate-180" : ""}`,
  
  dropdownMenu: "absolute top-12 right-0 w-48 bg-surface-app rounded-xl shadow-md border border-border-app z-50 py-1 overflow-hidden",
  dropdownHeader: "px-4 py-3 border-b border-border-app bg-bg-app",
  dropdownAvatar: "w-6 h-6 rounded-lg bg-text-app flex items-center justify-center text-bg-app font-semibold text-xs font-serif",
  dropdownName: "text-[11px] text-text-app font-semibold",
  dropdownEmail: "text-[9px] text-muted-app mt-0.5",
  
  menuItemContainer: "p-1",
  menuItem: "w-full px-3 py-2 text-left hover:bg-bg-app text-xs text-text-app flex items-center gap-2 rounded-lg cursor-pointer transition-colors font-medium",
  menuItemBorder: "p-1 border-t border-border-app",
  logoutButton: "flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors font-medium"
};

export const signupStyles = {
  pageContainer: "min-h-screen flex items-center justify-center p-4 bg-bg-app transition-colors duration-200",
  
  cardContainer: "w-full max-w-sm bg-surface-app border border-border-app rounded-2xl shadow-sm overflow-hidden",
  
  header: "bg-bg-app p-6 text-center relative border-b border-border-app",
  avatar: "w-14 h-14 mx-auto rounded-xl bg-surface-app text-[var(--color-gold-hex)] flex items-center justify-center mb-3 border border-border-app shadow-2xs",
  headerTitle: "text-xl font-serif font-bold tracking-tight text-text-app",
  headerSubtitle: "text-muted-app text-xs mt-1 font-sans",
  backButton: "absolute top-4 left-4 p-1.5 text-muted-app hover:text-text-app rounded hover:bg-surface-app transition-colors cursor-pointer",
  
  formContainer: "p-6",
  
  apiError: "mb-4 text-center text-xs text-red-500 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20",
  fieldError: "mt-1.5 text-[10px] text-red-500 font-medium",
  
  label: "block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5",
  inputContainer: "relative",
  inputIcon: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-app",
  input: "w-full pl-10 pr-4 py-2.5 bg-bg-app border border-border-app text-text-app rounded-xl text-xs focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] focus:outline-none transition-all",
  passwordInput: "w-full pl-10 pr-10 py-2.5 bg-bg-app border border-border-app text-text-app rounded-xl text-xs focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] focus:outline-none transition-all",
  passwordToggle: "absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-app hover:text-text-app transition-colors",
  
  checkboxContainer: "mb-4 flex items-center",
  checkbox: "w-3.5 h-3.5 text-[var(--color-gold-hex)] border-border-app rounded focus:ring-[var(--color-gold-hex)] bg-bg-app cursor-pointer",
  checkboxLabel: "ml-2.5 block text-xs text-muted-app font-medium cursor-pointer font-sans",
  
  button: "w-full bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center cursor-pointer text-xs shadow-xs",
  buttonDisabled: "opacity-85 cursor-not-allowed",
  
  signInContainer: "mt-5 text-center border-t border-border-app pt-4",
  signInText: "text-xs text-muted-app font-sans",
  signInLink: "font-semibold text-[var(--color-gold-hex)] hover:underline",
  
  spinner: "animate-spin -ml-1 mr-2 h-4 w-4 text-bg-app"
};

export const transactionItemStyles = {
  container: (isEditing: boolean, classes: { bg: string }) => 
    `flex flex-col md:flex-row items-stretch justify-between gap-4 p-4 rounded-xl border border-border-app mb-3.5 last:mb-0 transition-all duration-150 shadow-2xs ${
      isEditing ? "bg-surface-app border-[var(--color-gold-hex)]/40" : "bg-bg-app hover:bg-surface-app/40"
    }`,
  
  mainContainer: "flex items-center gap-3.5 flex-1 min-w-0",
  actionsContainer: "flex items-center justify-between gap-3.5 mt-3 md:mt-0 flex-shrink-0",
  amountContainer: "min-w-[100px] flex-shrink-0 flex justify-end items-center",
  buttonsContainer: "flex gap-1.5 flex-shrink-0",
  
  iconContainer: (iconClass: string, classes: { iconBg: string }) => `p-2 bg-surface-app border border-border-app text-[var(--color-gold-hex)] rounded-lg flex-shrink-0`,
  
  contentContainer: "min-w-0 flex-1",
  description: "font-medium text-text-app text-xs truncate",
  details: "text-[10px] text-muted-app mt-0.5 truncate font-sans tracking-wide",
  
  input: (hasError: boolean, classes: { border: string; ring: string }) => 
    `w-full bg-bg-app border rounded-xl px-3 py-1.5 text-xs text-text-app focus:outline-none focus:ring-1 ${
      hasError ? "border-red-500 ring-red-500" : "border-border-app focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)]"
    } transition-all`,
  amountInput: (hasError: boolean, classes: { border: string; ring: string }) => 
    `w-full max-w-[110px] bg-bg-app border rounded-xl px-3 py-1.5 text-xs text-text-app focus:outline-none focus:ring-1 ${
      hasError ? "border-red-500 ring-red-500" : "border-border-app focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)]"
    } transition-all`,
  
  errorText: "text-[10px] text-red-500 mt-1.5 font-medium",
  
  amountText: (amountClass: string, classes: { text: string }, type: "income" | "expense" = "expense") => 
    `font-semibold text-xs text-right block truncate min-w-[80px] ${
      type === "income" ? "text-[#5E7A68]" : "text-[#9B5B57]"
    }`,
  
  saveButton: (classes: { button: string }) => `p-1.5 text-text-app hover:bg-surface-app border border-border-app rounded-lg cursor-pointer transition-colors`,
  cancelButton: "p-1.5 text-muted-app hover:text-text-app hover:bg-surface-app border border-border-app rounded-lg cursor-pointer transition-colors",
  editButton: (classes: { text: string; bg: string }) => `p-1.5 text-muted-app hover:text-[var(--color-gold-hex)] hover:bg-surface-app rounded-lg transition-all cursor-pointer`,
  deleteButton: (classes: { text: string; bg: string }) => `p-1.5 text-muted-app hover:text-red-500 hover:bg-surface-app rounded-lg transition-all cursor-pointer`
};

export const sidebarStyles = {
  sidebarContainer: {
    base: "hidden lg:flex flex-col pt-0 fixed top-16 bottom-0 z-30 transition-all duration-200"
  },
  
  sidebarInner: {
    base: "bg-surface-app border-r border-border-app h-full flex flex-col justify-between w-full shadow-3xs"
  },
  
  userProfileContainer: {
    base: "p-4 border-b border-border-app",
    collapsed: "px-3",
    expanded: "px-5"
  },
  
  userInitials: {
    base: "w-9 h-9 rounded-lg bg-text-app text-bg-app flex items-center justify-center font-bold text-sm font-serif shadow-2xs"
  },
  
  menuList: {
    base: "space-y-2 px-3.5 py-5"
  },
  
  menuItem: {
    base: "relative flex items-center gap-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer",
    active: "text-text-app bg-bg-app border border-border-app shadow-2xs font-bold",
    inactive: "text-muted-app hover:text-text-app hover:bg-bg-app/50",
    collapsed: "justify-center px-0 mx-1",
    expanded: "px-4"
  },
  
  menuIcon: {
    active: "text-[var(--color-gold-hex)]",
    inactive: "text-muted-app"
  },
  
  activeIndicator: "absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-[var(--color-gold-hex)] rounded-full",
  
  toggleButton: {
    base: "absolute -right-2.5 top-5 z-20 w-5 h-5 bg-surface-app border border-border-app rounded-full flex items-center justify-center text-muted-app hover:text-text-app shadow-2xs transition-all cursor-pointer"
  },
  
  footerContainer: {
    base: "border-t border-border-app p-4",
    collapsed: "px-3",
    expanded: "px-5"
  },
  
  footerLink: {
    base: "flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-muted-app hover:text-text-app transition-colors",
    collapsed: "justify-center"
  },
  
  logoutButton: {
    base: "flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-muted-app hover:text-red-500 w-full cursor-pointer transition-all",
    collapsed: "justify-center"
  },
  
  mobileOverlay: "fixed inset-0 z-40 lg:hidden",
  mobileBackdrop: "absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-3xs",
  
  mobileSidebar: {
    base: "absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-surface-app shadow-xl rounded-r-2xl overflow-hidden border-r border-border-app"
  },
  
  mobileHeader: "p-5 flex justify-between items-center border-b border-border-app",
  mobileUserContainer: "flex items-center gap-3",
  mobileCloseButton: "p-1.5 rounded-lg hover:bg-bg-app cursor-pointer text-muted-app",
  
  mobileMenuList: "space-y-2 px-3.5 py-5",
  mobileMenuItem: {
    base: "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all",
    active: "text-text-app bg-bg-app border border-border-app shadow-2xs font-bold",
    inactive: "text-muted-app hover:bg-bg-app/40"
  },
  
  mobileFooter: "border-t border-border-app p-5 mt-auto",
  mobileFooterLink: "flex items-center gap-3 py-2 text-xs font-semibold text-muted-app hover:text-text-app",
  mobileLogoutButton: "flex items-center gap-3 py-2.5 text-xs font-semibold text-muted-app hover:text-red-500 w-full cursor-pointer transition-colors",
  
  mobileMenuButton: "lg:hidden fixed bottom-5 right-5 z-40 w-11 h-11 bg-text-app text-bg-app rounded-full flex items-center justify-center shadow-md active:scale-95 cursor-pointer text-[var(--color-gold-hex)]"
};

export const styles = {
  layout: {
    root: "min-h-screen bg-bg-app text-text-app transition-colors duration-200",
    mainContainer: (sidebarCollapsed: boolean) => 
      `p-4 md:p-8 pt-4 transition-all duration-200 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pb-24 lg:pb-8`, 
  },

  header: {
    container: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3",
    title: "text-xl font-serif font-bold tracking-tight text-text-app",
    subtitle: "text-muted-app text-xs font-sans mt-0.5",
  },

  grid: {
    main: "grid grid-cols-1 lg:grid-cols-3 gap-6",
    leftColumn: "lg:col-span-2 space-y-6",
    rightColumn: "lg:col-span-1 space-y-6",
  },

  cards: {
    base: "bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs transition-all duration-150",
    header: "flex justify-between items-center mb-4",
    title: "text-sm font-serif font-semibold text-text-app flex items-center gap-2",
    titleIcon: "w-4 h-4 text-[var(--color-gold-hex)]",
  },
};
