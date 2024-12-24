export const Field = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const FieldError = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm font-medium text-destructive">{children}</p>;
};

export const FieldDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};
