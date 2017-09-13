pragma solidity ^0.4.11;
contract SampleMath {
    function add(uint256 a, uint256 b) constant returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        addEvent(a, b, c);
        return c;
    }

    event addEvent(uint256 a, uint256 b, uint256 c);
}
