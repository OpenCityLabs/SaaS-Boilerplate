export const CenteredHero = (props: {
  banner: React.ReactNode;
  title: React.ReactNode;
  description: string;
  buttons: React.ReactNode;
}) => (
  <>
    <div className="text-center">{props.banner}</div>

    <div className="mt-3 text-center text-6xl font-bold tracking-tight">
      {props.title}
    </div>

    <div className="mx-auto mt-5 max-w-screen-md text-center text-2xl text-muted-foreground">
      {props.description.split('\n').map((line, index) => (
        <div key={index} className={index > 0 ? 'mt-3' : ''} dangerouslySetInnerHTML={{ __html: line }} />
      ))}
    </div>

    <div className="mt-8 flex justify-center gap-x-5 gap-y-3 max-sm:flex-col">
      {props.buttons}
    </div>
  </>
);
