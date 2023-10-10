export class GlobalConstants {


  public static genericError: string = "Something went wrong. Please try again later.";

  public static unauthorizedMessage: string = "You are not authorized to access this page.";

  public static productExistError: string = "Product already exist.";

  public static productAdded: string = "Product added successfully.";

  public static nameRegex: RegExp = /^[A-Za-z\s]+$/;

  public static emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  public static contactNumberRegex: RegExp = /^[0-9]{10}$/

  public static error: string = "error"
}
