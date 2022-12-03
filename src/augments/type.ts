export type EnsureExtend<Expected, CheckingType> = CheckingType extends Expected
    ? CheckingType
    : never;
