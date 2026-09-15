// Several backend responses populate a reference field (e.g. Doctor.userId,
// Patient.userId) with the full referenced document instead of leaving it as
// a plain ObjectId string - it depends on whether the endpoint used
// .populate(). This helper handles both shapes so callers don't have to
// duplicate the "is this a string or an object" check everywhere.
export function resolveId(value: string | { _id: string } | null | undefined): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value._id;
}
