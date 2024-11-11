interface CardListProps {
  children: React.ReactNode
}

export const CardList = ({ children }: CardListProps): JSX.Element => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>
  </div>
  )
}
