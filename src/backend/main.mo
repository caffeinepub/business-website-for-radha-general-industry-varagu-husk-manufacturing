import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
    department : Text;
  };

  type AttMonth = {
    staffName : Text;
    monthYear : Text;
    absent : Nat;
    cl : Nat;
    el : Nat;
    sl : Nat;
    present : Nat;
    weekoff : Nat;
    totalDays : Nat;
    pf : Float;
    esi : Float;
    grossPay : Float;
    salaryAdvance : Float;
    basic : Float;
    da : Float;
    otherAllowances : Float;
  };

  type AttSalary = {
    earnablePay : Float;
    netPay : Float;
    monthlyGrossPay : Float;
    totalDays : Float;
    paidDays : Float;
  };

  type Staff = {
    name : Text;
    mobile : Text;
    designation : Text;
    basic : Float;
    da : Float;
    otherAllowance : Float;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let staffList = Map.empty<Text, Staff>();
  let attMonths = Map.empty<Text, AttMonth>();
  let finalizedSalaries = Map.empty<Text, AttSalary>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getStaff(from : Nat, to : Nat) : async [Staff] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view staff");
    };

    let staffListIter = staffList.values();
    let filteredStaff = staffListIter.enumerate().filter(
      func((index, _)) { index >= from and index < to }
    );
    let mappedStaff = filteredStaff.map(func((_, staff)) { staff });
    mappedStaff.toArray();
  };

  public shared ({ caller }) func saveAttMonth(
    staffName : Text,
    monthYear : Text,
    absent : Nat,
    cl : Nat,
    el : Nat,
    sl : Nat,
    present : Nat,
    weekoff : Nat,
    totalDays : Nat,
    pf : Float,
    esi : Float,
    grossPay : Float,
    salaryAdvance : Float,
    basic : Float,
    da : Float,
    otherAllowances : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save attendance");
    };

    let attMonth : AttMonth = {
      staffName;
      monthYear;
      absent;
      cl;
      el;
      sl;
      present;
      weekoff;
      totalDays;
      pf;
      esi;
      grossPay;
      salaryAdvance;
      basic;
      da;
      otherAllowances;
    };

    attMonths.add(staffName, attMonth);
  };

  public query ({ caller }) func getAttMonth(name : Text) : async ?AttMonth {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance");
    };

    attMonths.get(name);
  };

  public shared ({ caller }) func addStaff(
    name : Text,
    mobile : Text,
    designation : Text,
    basic : Float,
    da : Float,
    otherAllowance : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add staff");
    };

    let staff : Staff = {
      name;
      mobile;
      designation;
      basic;
      da;
      otherAllowance;
    };

    staffList.add(name, staff);
  };

  public shared ({ caller }) func finalizeSalary(staffId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can finalize salaries");
    };

    let attMonth = switch (attMonths.get(staffId)) {
      case (null) { Runtime.trap("Attendance record for staff not found") };
      case (?attMonth) { attMonth };
    };

    let totalLeave = attMonth.cl + attMonth.el + attMonth.sl;
    let paidDays = attMonth.present + totalLeave + attMonth.weekoff;

    let monthlyGrossPayFloat = attMonth.grossPay;
    let totalDaysFloat = attMonth.totalDays.toFloat();

    let paidDaysFloat = paidDays.toFloat();
    let earnablePay = (monthlyGrossPayFloat / totalDaysFloat) * paidDaysFloat;
    let totalDeductions = attMonth.salaryAdvance + attMonth.pf + attMonth.esi;
    let netPay = earnablePay - totalDeductions;

    let attSalary : AttSalary = {
      earnablePay;
      netPay;
      monthlyGrossPay = monthlyGrossPayFloat;
      totalDays = totalDaysFloat;
      paidDays = paidDaysFloat;
    };

    finalizedSalaries.add(staffId, attSalary);
  };

  public query ({ caller }) func getNetPay(key : Text) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view net pay");
    };

    switch (finalizedSalaries.get(key)) {
      case (null) { Runtime.trap("Finalized salary not found for staff") };
      case (?salary) { salary.netPay };
    };
  };

  public query func healthCheck() : async Text {
    "healthy";
  };
};
